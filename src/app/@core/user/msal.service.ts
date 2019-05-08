import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { User } from 'msal/lib-commonjs/User';

import { environment } from '../../../environments/environment';

@Injectable()
export class MsalService {
    private authority = `https://login.microsoftonline.com/tfp/${environment.tenant}/${environment.signUpSignInPolicy}`;

    private clientApplication: Msal.UserAgentApplication;

    constructor() {
        this.clientApplication =
            new Msal.UserAgentApplication(
                environment.clientID,
                this.authority,
                this.authCallback,
                {
                    redirectUri: window.location.origin
                });
    }

    public login(): void {
        this.clientApplication.loginRedirect(environment.b2cScopes);
    }

    public logout(): void {
        this.clientApplication.logout();
        sessionStorage.removeItem('AppUser');
    }

    public isOnline(): boolean {
        return this.clientApplication.getUser() != null;
    }

    public getUser(): User {
        const user = this.clientApplication.getUser();
        if (user != null) {
            const clientInfoArray = user.userIdentifier.split('.');
            const decodedClientInfo = this.base64DecodeStringUrlSafe(clientInfoArray[0]);
            const decodedClientInfo2 = this.base64DecodeStringUrlSafe(clientInfoArray[1]);
            // const clientInfo = JSON.parse(decodedClientInfo);
            user.displayableId = decodedClientInfo.substr(0, decodedClientInfo.lastIndexOf('-'));
        }
        return user;
    }

    private base64DecodeStringUrlSafe(base64IdToken: string): string {
        // html5 should support atob function for decoding
        base64IdToken = base64IdToken.replace(/-/g, '+').replace(/_/g, '/');
        if (window.atob) {
            return decodeURIComponent(window.atob(base64IdToken)); // jshint ignore:line
        } else {
            return decodeURIComponent(this.decode(base64IdToken));
        }
    }

    private decode(base64IdToken: string): string {
        const codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        base64IdToken = String(base64IdToken).replace(/=+$/, '');
        const length = base64IdToken.length;
        if (length % 4 === 1) {
            throw new Error('The token to be decoded is not correctly encoded.');
        }
        let h1: number, h2: number, h3: number, h4: number, bits: number, c1: number, c2: number, c3: number, decoded = '';
        // tslint:disable:no-bitwise
        for (let i = 0; i < length; i += 4) {
            // Every 4 base64 encoded character will be converted to 3 byte string, which is 24 bits
            // then 6 bits per base64 encoded character
            h1 = codes.indexOf(base64IdToken.charAt(i));
            h2 = codes.indexOf(base64IdToken.charAt(i + 1));
            h3 = codes.indexOf(base64IdToken.charAt(i + 2));
            h4 = codes.indexOf(base64IdToken.charAt(i + 3));
            // For padding, if last two are "="
            if (i + 2 === length - 1) {
                bits = h1 << 18 | h2 << 12 | h3 << 6;
                c1 = bits >> 16 & 255;
                c2 = bits >> 8 & 255;
                decoded += String.fromCharCode(c1, c2);
                break;
            } else if (i + 1 === length - 1) { // if last one is "="
                bits = h1 << 18 | h2 << 12;
                c1 = bits >> 16 & 255;
                decoded += String.fromCharCode(c1);
                break;
            }
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            // then convert to 3 byte chars
            c1 = bits >> 16 & 255;
            c2 = bits >> 8 & 255;
            c3 = bits & 255;
            decoded += String.fromCharCode(c1, c2, c3);
        }
        return decoded;
    }

    public getAuthenticationToken(): Promise<string> {
        return this.clientApplication.acquireTokenSilent(environment.b2cScopes)
            .then(token => {
                return token;
            }).catch(error => {
                if (this.isOnline()) {
                    return this.clientApplication.acquireTokenPopup(environment.b2cScopes)
                    .then(token => {
                        return Promise.resolve(token);
                    }).catch(innererror => {
                        console.error('Could not retrieve token from popup.', innererror);
                        return Promise.resolve('');
                    });
                }
                this.login();
            });
    }

    private authCallback(errorDesc: any, token: any, error: any, tokenType: any) {
        if (error) {
            console.error(`${error} ${errorDesc}`);
        }
    }
}
