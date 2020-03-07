/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    Button,
    View,
} from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';

function App() {
    return (
        <View style={styles.container}>
            <LoginButton/>
        </View>
    );
};

function LoginButton() {
    const [loggedIn, setLoggedIn] = useState(false);

    function login() {
        LoginManager.logInWithPermissions(['public_profile']).then((result: LoginResult) => {
            if (result.error) {
                console.log('Error: ', result.error);
            } else {
                if (result.isCancelled) {
                    console.log('Login is cancelled');
                } else {
                    setLoggedIn(true);
                    console.log('Logged in');
                }
            }
        })
    }

    function logout() {
        LoginManager.logOut();
        setLoggedIn(false);
        console.log('Logout');
    }

    if (loggedIn)
        return (
            <Button
                title='Logout Facebook'
                onPress={logout}
            />
        )

    return (
        <Button
            title='Login with Facebook'
            onPress={login}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
    }
});

export default App;
