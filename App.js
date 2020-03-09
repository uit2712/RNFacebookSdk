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

function App() {
    return (
        <View style={styles.container}>
            <LoginButton />
        </View>
    );
};

function LoginButton() {
    const [loggedIn, setLoggedIn] = useState(false);

    function login() {
        LoginManager.logInWithPermissions(['public_profile']).then((result) => {
            if (result.error) {
                console.log('Error: ', result.error);
            } else {
                if (result.isCancelled) {
                    console.log('Login is cancelled');
                } else {
                    setLoggedIn(true);
                    console.log('Logged in: ', result);
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
            <>
                <FbBasicInfo loggedIn={loggedIn} />
                <Button
                    title='Logout Facebook'
                    onPress={logout}
                />
            </>
        )

    return (
        <Button
            title='Login with Facebook'
            onPress={login}
        />
    )
}

function FbBasicInfo({
    loggedIn
}) {
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');

    function getBasicInfo() {
        AccessToken.getCurrentAccessToken().then(data => {
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
                } = result;
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                    setAvatar(data);
                    setName(name);
                }
            });
    
            const graphRequestManager = new GraphRequestManager();
            graphRequestManager.addRequest(graphRequest).start();
        });
    }

    useEffect(() => {
        getBasicInfo();
    }, [loggedIn]);

    useEffect(() => {
        console.log(avatar);
    }, [avatar]);

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
