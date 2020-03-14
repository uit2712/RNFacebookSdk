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
                    resolve({
                        message: 'Login success'
                    })
                }
            }
        }).catch((error: Error) => {
            reject({
                message: error.message
            })
        });
    })
}

export function logout(isRefreshAccessToken = false): Promise<ILogoutFBResult> {
    return new Promise(async (
        resolve: (value?: ILogoutFBResult | PromiseLike<ILogoutFBResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        if (isRefreshAccessToken) {
            await AccessToken.refreshCurrentAccessTokenAsync();
        }
        LoginManager.logOut();
        resolve({
            message: 'Logout success'
        })
    })
}

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
    
            let graphRequestManager = new GraphRequestManager();
            graphRequestManager.addRequest(graphRequest).start();
        }).catch((error: Error) => {
            reject({
                message: error.message
            })
        });
    })
}