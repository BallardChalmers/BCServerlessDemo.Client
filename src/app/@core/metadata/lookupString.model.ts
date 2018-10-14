export class LookupString {
    id: string;
    name: string;

    // This function must be bound to a select control like this [compareWith]="lookupString.compareLookup"
    // must also use ngValue on the control and not forget to bind LookupString as a property in the component!
    compareLookup(l1: LookupString, l2: LookupString) {
        return l1 && l2 ? l1.id === l2.id : l1 === l2;
    }
}
