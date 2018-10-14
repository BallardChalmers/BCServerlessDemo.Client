import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class CertifiedService {
    private certifiedSource = new Subject<void>();
    certified$ = this.certifiedSource.asObservable();

    certified() {
        this.certifiedSource.next();
    }
}
