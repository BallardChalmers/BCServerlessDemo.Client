import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { cloneDeep, filter, findIndex, map, remove, some } from 'lodash';
import { Organisation } from '../@core/organisations/organisation.model';
import { OrganisationDisplay } from '../@core/organisations/organisationdisplay.model';
import { OrganisationService } from '../@core/organisations/organisation.service';
import { GridQueryStateService, QueryKeys } from '../@core/search/gridquerystateservice.service';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { ViewportCollectionService } from '../@core/utilities/viewportcollection.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RagStatus } from '../@core/enum';
import { ConfirmModalComponent } from '../shared/confirmModal/confirmModal.component';

@Component({
    templateUrl: './organisations.component.html',
    styleUrls: ['./organisations.component.scss'],
})
export class OrganisationComponent implements OnInit {
    public viewableOrganisations = new ViewportCollectionService<OrganisationDisplay>();

    totalOrganisations = 0;
    validOrganisations = 0;
    organisations: Organisation[];
    currentSearch = '';
    pageSize = 25;

    constructor(private organisationService: OrganisationService,
        private gridQueryStateService: GridQueryStateService,
        private roleCheck: RoleCheck,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        this.getOrganisations();
    }

    getOrganisations() {
        const query = this.gridQueryStateService.getQuery(QueryKeys.Organisations);
        this.gridQueryStateService.setSearchQuery(query, this.currentSearch);
        query.pageSize = this.pageSize;

        this.roleCheck.roleRequiresApproval().subscribe(roleRequiresApproval => {
            query.replaceUnapproved = roleRequiresApproval;

            this.organisationService.search(query).subscribe(s => {
                this.viewableOrganisations.collection = map(s.results, t => <OrganisationDisplay>t);
                this.viewableOrganisations.total = s.count;
                this.totalOrganisations = s.total;
            });
        });
    }

    loadMore(pageSize: number) {
        this.pageSize = pageSize;
        this.getOrganisations();
    }

    search(searchText: string) {
        this.currentSearch = searchText;
        this.getOrganisations();

    }

    cancelSearch() {
        this.currentSearch = '';
        this.getOrganisations();
    }

    /*
    displayDocuments(organisationDisplay: OrganisationDisplay) {
        organisationDisplay.displayDocuments = !organisationDisplay.displayDocuments;
    }
    */
    addOrganisation() {
        const organisation = new OrganisationDisplay();
        organisation.edit = true;
        organisation.isNew = true;
        this.viewableOrganisations.collection.unshift(organisation);
        this.viewableOrganisations.total++;
        this.viewableOrganisations.reset();
    }

    editCancelled(organisation: OrganisationDisplay) {
        if (organisation.isNew === true) {
            remove(this.viewableOrganisations.collection, t => t.isNew);
            this.viewableOrganisations.total = this.viewableOrganisations.collection.length;
            this.viewableOrganisations.reset();
        } else {
            organisation.edit = false;
        }
    }

    startEdit(item: OrganisationDisplay) {
        item.edit = true;
    }

    /*
    documentsUpdated(organisation: Organisation) {
        this.organisationService.update(organisation).subscribe(tx => this.organisationUpdated(tx));
    }
    */

    organisationUpdated(updated: Organisation) {
        this.roleCheck.roleRequiresApproval().subscribe(requiresApproval => {
            this.onOrganisationUpdated(requiresApproval, updated);
        });
    }

    onOrganisationUpdated(requiresApproval: boolean, updated: Organisation) {
        this.updateOrganisationList(updated);
    }

    updateOrganisationList(updated: Organisation) {
        const index = findIndex(this.viewableOrganisations.collection, fi => fi.id === updated.id);
        const updatedDisplay = <OrganisationDisplay>updated;

        updatedDisplay.edit = false;

        if (index >= 0) {
            updatedDisplay.displayDocuments = this.viewableOrganisations.collection[index].displayDocuments;
            this.viewableOrganisations.collection[index] = updatedDisplay;
        } else {
            this.viewableOrganisations.collection.push(updatedDisplay);
        }
        this.viewableOrganisations.reset();
    }

    deleteOrganisation(id: string) {
        const modalRef = this.modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = 'Confirm Delete';
        modalRef.componentInstance.message = 'Are you sure you want to delete the Organisation?';

        modalRef.result.then((response) => {
            if (response === true) {
                this.organisationService.deleteOrganisation(id).subscribe((organisation) => {
                    if (organisation.deleted) {
                        const index = findIndex(this.viewableOrganisations.collection, fi => fi.id === id);
                        this.viewableOrganisations.collection.splice(index, 1);
                        this.viewableOrganisations.total--;
                        this.viewableOrganisations.reset();
                    } else {
                        this.onOrganisationUpdated(false, organisation);
                    }
                });
            }
        });
    }

    formatMatches = (value: any) => value.name || '';
/*
    searchCourse = (text$: Observable<string>) =>
        text$.debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.journeySearching = true)
            .switchMap(term => term.length < 2 ? []
                : this.approvedCourseService.getCourses(term)
                    .map(m => filter(m.results, c => {
                        return c.productSpecifics.length > 0 && some(c.productSpecifics, ps => ps.requiredEvidence.length > 0);
                    }).slice(0, 10))
                    .do(() => this.journeySearchFailed = false)
                    .catch(() => {
                        this.journeySearchFailed = true;
                        return Observable.of([]);
                    }))
            .do(() => this.journeySearching = false)

    addCourse(event: any, input: any, organisation: OrganisationDisplay) {
        event.preventDefault();
        input.value = '';

        const approvedCourse = event.item as ApprovedCourse;

        const specificsToAdd = filter(approvedCourse.productSpecifics, ps => ps.requiredEvidence.length > 0 &&
            !some(organisation.documents, dg => dg.productSpecificId === ps.id));
        specificsToAdd.forEach(ps => {
            const docGroup = new DocumentGroup();
            docGroup.name = ps.isDefault ? approvedCourse.name : `${approvedCourse.name}: ${ps.name}`;
            docGroup.approvedCourseId = approvedCourse.id;
            docGroup.productSpecificId = ps.id;
            docGroup.documents = map(ps.requiredEvidence, (re) => {
                const doc = new DocInfo();
                doc.documentId = '';    // the documentId will be generated server side
                doc.requiredDocumentId = re.id;
                doc.name = re.name;
                doc.requiresExpiryDate = re.hasExpiryDate;
                return doc;
            });
            organisation.documents.push(docGroup);
        });

        this.organisationService.update(organisation).subscribe(updated => {
            this.organisationUpdated(updated);
        });
    }
*/

    openFilter() {
        /*
        const modalRef = this.modalService.open(OrganisationFilterComponent, { size: 'lg' });

        modalRef.componentInstance.emitData.subscribe(($e) => {
            this.isClearFilter = this.gridQueryStateService.isFilterClear(QueryKeys.Organisations);
            this.getOrganisations();
        });
        */
    }

    /*
    disable(organisation: OrganisationDisplay) {
        const modalRef = this.modalService.open(DisableOrganisationComponent, { size: 'lg' });

        modalRef.componentInstance.disableEmitter.subscribe((reason) => {
            const organisationToUpdate = cloneDeep(organisation);
            organisationToUpdate.isDisabled = true;
            organisationToUpdate.disableReason = reason;
            this.organisationService.update(organisationToUpdate).subscribe(updated => {
                this.onOrganisationUpdated(false, updated);
            });
        });
    }

    enable(organisation: OrganisationDisplay) {
        const organisationToUpdate = cloneDeep(organisation);
        organisationToUpdate.isDisabled = false;
        organisation.disableReason = '';
        this.organisationService.update(organisationToUpdate).subscribe(updated => {
            this.onOrganisationUpdated(false, updated);
        });
    }
*/
    getRagStatus(organisation: OrganisationDisplay): RagStatus {
        /*
        if (organisation.ragStatusOverride !== RagStatus.Auto) {
            return organisation.ragStatusOverride;
        }

        if (some(organisation.documents[0].documents, d => d.files.length === 0)) {
            return RagStatus.Red;
        }

        const now = moment();
        if (some(organisation.documents[0].documents, d => !d.expiryDate || moment(d.expiryDate) < now)) {
            return RagStatus.Red;
        }

        const nowPlus20Days = this.addWeekdays(moment(), 20);
        if (some(organisation.documents[0].documents, d => moment(d.expiryDate) < nowPlus20Days)) {
            return RagStatus.Amber;
        }
*/
        return RagStatus.Green;
    }

    /*
    requiresDocuments(organisation: OrganisationDisplay) {
        return some(organisation.documents, d => !!d.approvedCourseId);
    }

    addLinkedDoc(organisation: OrganisationDisplay) {
        const modalRef = this.modalService.open(LinkedDocumentComponent, { size: 'lg' });
        const linkedDocumentComponent = modalRef.componentInstance as LinkedDocumentComponent;
        linkedDocumentComponent.organisation = organisation;

        linkedDocumentComponent.savedEmitter.subscribe((organisationToUpdate) => {
            this.organisationService.update(organisationToUpdate).subscribe(updated => {
                this.organisationUpdated(updated);
            });
        });
    }

    private addWeekdays(date: moment.Moment, days: number) {
        let dayCount = days;
        const newDate = moment(date); // use a clone
        while (dayCount > 0) {
            newDate.add(1, 'days');
            // decrease "days" only if it's a weekday.
            if (newDate.isoWeekday() !== 6 && newDate.isoWeekday() !== 7) {
                dayCount -= 1;
            }
        }
        return newDate;
    }
    */
}
