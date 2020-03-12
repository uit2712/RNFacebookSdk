import { Permission } from '../types/Permission';
import { LoginManager, LoginResult, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import ILoginFBResult from '../interfaces/ILoginFBResult';
import IError from '../interfaces/IError';
import ILogoutFBResult from '../interfaces/ILogoutFBResult';
import IBasicInfoResult from '../interfaces/IBasicInfoResult';

export function login(permissions: Permission[]): Promise<ILoginFBResult> {
    return new Promise((
        resolve: (value?: ILoginFBResult | PromiseLike<ILoginFBResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        LoginManager.logInWithPermissions(permissions)
        .then((result: LoginResult) => {
            if (result.error)
                reject({
                    message: `Login failed: ${result.error.message}`
                })
            else {
                if (result.isCancelled) {
                    reject({
                        message: 'Login is cancelled'
                    })
                } else {
                    return resolve({
                        message: 'Login success'
                    })
                }
            }
        });
    })
}

export function logout(): Promise<ILogoutFBResult> {
    return new Promise((
        resolve: (value?: ILogoutFBResult | PromiseLike<ILogoutFBResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        LoginManager.logOut();
        resolve({
            message: 'Logout success'
        })
    })
}

const graphRequestManager = new GraphRequestManager();

export function getBasicInfo(): Promise<IBasicInfoResult> {
    return new Promise((
        resolve: (value?: IBasicInfoResult | PromiseLike<IBasicInfoResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        AccessToken.getCurrentAccessToken().then(data => {
            if (data === null || data === undefined)
                reject({
                    message: 'Access token not found'
                })

            const { accessToken } = data;
            let graphRequest = new GraphRequest('/me', {
                accessToken,
                parameters: {
                    fields: {
                        string: 'picture.type(large),name',
                    }
                }
            }, (error, result) => {
                const {
                    picture: {
                        data
                    },
                    name,
                } = result as any;
                if (error) {
                    reject({
                        message: 'Failed to get basic info'
                    })
                } else {
                    resolve({
                        avatar: data,
                        name
                    })
                }
            });
    
            graphRequestManager.addRequest(graphRequest).start();
        });
    })
}