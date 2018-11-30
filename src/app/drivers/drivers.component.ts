import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { cloneDeep, filter, findIndex, map, remove, some } from 'lodash';
import { Driver } from '../@core/drivers/driver.model';
import { DriverDisplay } from '../@core/drivers/driverdisplay.model';
import { DriverService } from '../@core/drivers/driver.service';
import { GridQueryStateService, QueryKeys } from '../@core/search/gridquerystateservice.service';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { ViewportCollectionService } from '../@core/utilities/viewportcollection.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RagStatus } from '../@core/enum';
import { ConfirmModalComponent } from '../shared/confirmModal/confirmModal.component';

@Component({
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
})
export class DriverComponent implements OnInit {
    public viewableDrivers = new ViewportCollectionService<DriverDisplay>();

    totalDrivers = 0;
    validDrivers = 0;
    drivers: Driver[];
    currentSearch = '';
    pageSize = 25;

    constructor(private driverService: DriverService,
        private gridQueryStateService: GridQueryStateService,
        private roleCheck: RoleCheck,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        this.getDrivers();
    }

    getDrivers() {
        const query = this.gridQueryStateService.getQuery(QueryKeys.Drivers);
        this.gridQueryStateService.setSearchQuery(query, this.currentSearch);
        query.pageSize = this.pageSize;

        this.roleCheck.roleRequiresApproval().subscribe(roleRequiresApproval => {
            query.replaceUnapproved = roleRequiresApproval;

            this.driverService.search(query).subscribe(s => {
                this.viewableDrivers.collection = map(s.results, t => <DriverDisplay>t);
                this.viewableDrivers.total = s.count;
                this.totalDrivers = s.total;
            });
        });
    }

    loadMore(pageSize: number) {
        this.pageSize = pageSize;
        this.getDrivers();
    }

    search(searchText: string) {
        this.currentSearch = searchText;
        this.getDrivers();

    }

    cancelSearch() {
        this.currentSearch = '';
        this.getDrivers();
    }

    /*
    displayDocuments(driverDisplay: DriverDisplay) {
        driverDisplay.displayDocuments = !driverDisplay.displayDocuments;
    }
    */
    addDriver() {
        const driver = new DriverDisplay();
        driver.edit = true;
        driver.isNew = true;
        this.viewableDrivers.collection.unshift(driver);
        this.viewableDrivers.total++;
        this.viewableDrivers.reset();
    }

    editCancelled(driver: DriverDisplay) {
        if (driver.isNew === true) {
            remove(this.viewableDrivers.collection, t => t.isNew);
            this.viewableDrivers.total = this.viewableDrivers.collection.length;
            this.viewableDrivers.reset();
        } else {
            driver.edit = false;
        }
    }

    startEdit(item: DriverDisplay) {
        item.edit = true;
    }

    /*
    documentsUpdated(driver: Driver) {
        this.driverService.update(driver).subscribe(tx => this.driverUpdated(tx));
    }
    */

    driverUpdated(updated: Driver) {
        this.roleCheck.roleRequiresApproval().subscribe(requiresApproval => {
            this.onDriverUpdated(requiresApproval, updated);
        });
    }

    onDriverUpdated(requiresApproval: boolean, updated: Driver) {
        this.updateDriverList(updated);
    }

    updateDriverList(updated: Driver) {
        const index = findIndex(this.viewableDrivers.collection, fi => fi.id === updated.id);
        const updatedDisplay = <DriverDisplay>updated;

        updatedDisplay.edit = false;

        if (index >= 0) {
            updatedDisplay.displayDocuments = this.viewableDrivers.collection[index].displayDocuments;
            this.viewableDrivers.collection[index] = updatedDisplay;
        } else {
            this.viewableDrivers.collection.push(updatedDisplay);
        }
        this.viewableDrivers.reset();
    }

    deleteDriver(id: string) {
        const modalRef = this.modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = 'Confirm Delete';
        modalRef.componentInstance.message = 'Are you sure you want to delete the Driver?';

        modalRef.result.then((response) => {
            if (response === true) {
                this.driverService.delete(id).subscribe((driver) => {
                    if (driver.deleted) {
                        const index = findIndex(this.viewableDrivers.collection, fi => fi.id === id);
                        this.viewableDrivers.collection.splice(index, 1);
                        this.viewableDrivers.total--;
                        this.viewableDrivers.reset();
                    } else {
                        this.onDriverUpdated(false, driver);
                    }
                });
            }
        });
    }

    isClearFilter(): boolean {
        return true;
    }

    canAddEdit(): boolean {
        return true;
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

    addCourse(event: any, input: any, driver: DriverDisplay) {
        event.preventDefault();
        input.value = '';

        const approvedCourse = event.item as ApprovedCourse;

        const specificsToAdd = filter(approvedCourse.productSpecifics, ps => ps.requiredEvidence.length > 0 &&
            !some(driver.documents, dg => dg.productSpecificId === ps.id));
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
            driver.documents.push(docGroup);
        });

        this.driverService.update(driver).subscribe(updated => {
            this.driverUpdated(updated);
        });
    }
*/

    openFilter() {
        /*
        const modalRef = this.modalService.open(DriverFilterComponent, { size: 'lg' });

        modalRef.componentInstance.emitData.subscribe(($e) => {
            this.isClearFilter = this.gridQueryStateService.isFilterClear(QueryKeys.Drivers);
            this.getDrivers();
        });
        */
    }

    /*
    disable(driver: DriverDisplay) {
        const modalRef = this.modalService.open(DisableDriverComponent, { size: 'lg' });

        modalRef.componentInstance.disableEmitter.subscribe((reason) => {
            const driverToUpdate = cloneDeep(driver);
            driverToUpdate.isDisabled = true;
            driverToUpdate.disableReason = reason;
            this.driverService.update(driverToUpdate).subscribe(updated => {
                this.onDriverUpdated(false, updated);
            });
        });
    }

    enable(driver: DriverDisplay) {
        const driverToUpdate = cloneDeep(driver);
        driverToUpdate.isDisabled = false;
        driver.disableReason = '';
        this.driverService.update(driverToUpdate).subscribe(updated => {
            this.onDriverUpdated(false, updated);
        });
    }
*/
    getRagStatus(driver: DriverDisplay): RagStatus {
        /*
        if (driver.ragStatusOverride !== RagStatus.Auto) {
            return driver.ragStatusOverride;
        }

        if (some(driver.documents[0].documents, d => d.files.length === 0)) {
            return RagStatus.Red;
        }

        const now = moment();
        if (some(driver.documents[0].documents, d => !d.expiryDate || moment(d.expiryDate) < now)) {
            return RagStatus.Red;
        }

        const nowPlus20Days = this.addWeekdays(moment(), 20);
        if (some(driver.documents[0].documents, d => moment(d.expiryDate) < nowPlus20Days)) {
            return RagStatus.Amber;
        }
*/
        return RagStatus.Green;
    }

    /*
    requiresDocuments(driver: DriverDisplay) {
        return some(driver.documents, d => !!d.approvedCourseId);
    }

    addLinkedDoc(driver: DriverDisplay) {
        const modalRef = this.modalService.open(LinkedDocumentComponent, { size: 'lg' });
        const linkedDocumentComponent = modalRef.componentInstance as LinkedDocumentComponent;
        linkedDocumentComponent.driver = driver;

        linkedDocumentComponent.savedEmitter.subscribe((driverToUpdate) => {
            this.driverService.update(driverToUpdate).subscribe(updated => {
                this.driverUpdated(updated);
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
