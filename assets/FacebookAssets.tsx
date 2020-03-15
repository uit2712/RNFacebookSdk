import { Permission } from "../types/Permission";
import ILoginFBResult from "../interfaces/ILoginFBResult";
import IError from "../interfaces/IError";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager, ShareLinkContent, ShareDialog, SharePhotoContent } from "react-native-fbsdk";
import ILogoutFBResult from "../interfaces/ILogoutFBResult";
import IBasicInfoResult from "../interfaces/IBasicInfoResult";
import IShareLinkResult from "../interfaces/IShareLinkResult";
import ISharePhotoResult from "../interfaces/ISharePhotoResult";

export function login(permissions: Permission[]): Promise<ILoginFBResult> {
    return new Promise((
        resolve: (value?: ILoginFBResult | PromiseLike<ILoginFBResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        LoginManager.logInWithPermissions(permissions)
            .then((result) => {
                if (result.error) {
                    reject({
                        message: `Login failed: ${result.error}`
                    })
                } else {
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
        })
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

export function getBasicInfo(): Promise<IBasicInfoResult> {
    return new Promise((
        resolve: (value?: IBasicInfoResult | PromiseLike<IBasicInfoResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        AccessToken.getCurrentAccessToken()
        .then(data => {
            if (data === null || data === undefined) {
                reject({
                    message: 'Access denied: access token not found'
                })
            }

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
                        message: `Get basic info failed: ${(error as any).message}`
                    })
                } else {
                    resolve({
                        avatar: data,
                        name
                    })
                }
            });
    
            const graphRequestManager = new GraphRequestManager();
            graphRequestManager.addRequest(graphRequest).start();
        });
    })
}

export function shareLink(shareLinkContent: ShareLinkContent): Promise<IShareLinkResult> {
    return new Promise((
        resolve: (value?: IShareLinkResult | PromiseLike<IShareLinkResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        ShareDialog.canShow(shareLinkContent)
        .then((canShow: boolean) => {
            if (canShow)
                return ShareDialog.show(shareLinkContent);
        }).then((result: any) => {
            if (result.isCancelled) {
                reject({
                    message: 'Share link is cancelled'
                })
            } else {
                resolve({
                    message: 'Share link success'
                })
            }
        }).catch((error: Error) => {
            reject({
                message: `Share link error: ${error.message}`
            })
        })
    })
}

export function sharePhoto(sharePhotoContent: SharePhotoContent): Promise<ISharePhotoResult> {
    return new Promise((
        resolve: (value?: ISharePhotoResult | PromiseLike<ISharePhotoResult>) => void,
        reject: (reason?: IError) => void
    ) => {
        ShareDialog.canShow(sharePhotoContent)
        .then((canShow: boolean) => {
            if (canShow)
                return ShareDialog.show(sharePhotoContent);
        }).then((result: any) => {
            if (result.isCancelled) {
                reject({
                    message: 'Share photo is cancelled'
                })
            } else {
                resolve({
                    message: 'Share photo success'
                })
            }
        }).catch((error: Error) => {
            reject({
                message: `Share photo error: ${error.message}`
            })
        })
    })
}