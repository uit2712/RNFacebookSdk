/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {
    useState,
    useEffect
} from 'react';
import {
    StyleSheet,
    Button,
    View,
    Image,
    Text,
} from 'react-native';
import { 
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    Permissions
} from 'react-native-fbsdk';
import { login, logout, getBasicInfo, shareLink, sharePhoto } from './assets/FacebookAssets';
import ILoginFBResult from './interfaces/ILoginFBResult';
import IError from './interfaces/IError';
import ILogoutFBResult from './interfaces/ILogoutFBResult';
import IBasicInfoResult from './interfaces/IBasicInfoResult';
import IShareLinkResult from './interfaces/IShareLinkResult';
import ISharePhotoResult from './interfaces/ISharePhotoResult';

function App() {
    return (
        <View style={styles.container}>
            <LoginButton />
        </View>
    );
};

function LoginButton() {
    const [loggedIn, setLoggedIn] = useState(false);

    function _login() {
        login(['public_profile'])
        .then((result: ILoginFBResult) => {
            console.log(result.message);
            setLoggedIn(true);
        }).catch((error: IError) => {
            console.log(error.message);
        })
    }

    function _logout() {
        logout()
        .then((result: ILogoutFBResult) => {
            console.log(result.message);
            setLoggedIn(false);
        }).catch((error: IError) => {
            console.log(error.message);
        })
    }

    if (loggedIn)
        return (
            <>
                <FbBasicInfo loggedIn={loggedIn} />
                <Button
                    title='Logout Facebook'
                    onPress={_logout}
                />
            </>
        )

    return (
        <Button
            title='Login with Facebook'
            onPress={_login}
        />
    )
}

function FbBasicInfo({
    loggedIn
}: {
    loggedIn: boolean
}) {
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');

    function _getBasicInfo() {
        getBasicInfo()
        .then((result: IBasicInfoResult) => {
            setAvatar(result.avatar);
            setName(result.name);
        }).catch((error: IError) => {
            console.log(error.message);
        })
    }

    useEffect(() => {
        if (loggedIn) {
            _getBasicInfo();
        }
    }, [loggedIn]);

    if (!loggedIn || !avatar)
        return null;

    const { url, width, height } = avatar;
    return (
        <View style={{
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
        }}>
            <Image
                source={{ uri: url }}
                style={styles.avatar}
                width={width}
                height={height}
            />
            <Text style={styles.name}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    name: {
        marginBottom: 10,
    }
});

export default App;
