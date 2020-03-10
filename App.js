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
    TextInput,
} from 'react-native';
import {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    ShareLinkContent,
    ShareDialog,
    SharePhotoContent,
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
        LoginManager.logInWithPermissions(['public_profile', 'pages_show_list', ' manage_pages']).then((result) => {
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
                <ShareDialogExample loggedIn={loggedIn} />
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

function ShareDialogExample({
    loggedIn
}) {
    const [contentDescription, setContentDescription] = useState('');
    const [contentUrl, setContentUrl] = useState('https://facebook.com');

    if (loggedIn === false)
        return null;

    useEffect(() => {
        AccessToken.getCurrentAccessToken()
            .then(data => {
                if (data === null)
                    return;
                const { accessToken, userID } = data;
                console.log(data);
                fetch(`https://graph.facebook.com/${userID}/accounts?access_token=${accessToken}`)
                .then(response => response.json())
                .then(json => console.log(json));
            })
    }, []);

    function shareLink() {
        const shareLinkContent: ShareLinkContent = {
            contentType: 'link',
            contentUrl,
            contentDescription,
            contentTitle: 'Facebook',
            commonParameters: {
                hashtag: '#abc',
                peopleIds: ['100043395240724']
            }
        };

        ShareDialog.canShow(shareLinkContent)
            .then((canShow) => {
                if (canShow) {
                    return ShareDialog.show(shareLinkContent);
                }
            }).then((result) => {
                console.log(result);
                if (result.isCancelled) {
                    console.log('Share cancelled');
                } else {
                    console.log('Share success with postId: '
                        + result.postId);
                }
            })
    }

    function sharePhoto() {
        const sharePhotoContent: SharePhotoContent = {
            contentType: 'photo',
            photos: [{
                imageUrl: 'https://i.ytimg.com/vi/T7jFKia58M8/maxresdefault.jpg',
                caption: 'Hihi'
            }],
            commonParameters: {
                peopleIds: ['100043395240724']
            }
        }

        ShareDialog.canShow(sharePhotoContent)
            .then((canShow) => {
                if (canShow) {
                    return ShareDialog.show(sharePhotoContent);
                }
            }).then((result) => {
                console.log(result);
                if (result.isCancelled) {
                    console.log('Share cancelled');
                } else {
                    console.log('Share success with postId: '
                        + result.postId);
                }
            })
    }

    return (
        <View style={styles.sharingContainer}>
            <TextInput
                value={contentUrl}
                placeholder='Content Url'
                onChangeText={(text) => setContentUrl(text)}
            />
            <TextInput
                value={contentDescription}
                placeholder='Content Description'
                onChangeText={(text) => setContentDescription(text)}
            />
            <Button
                style={styles.sharingButton}
                title='Share'
                onPress={shareLink}
                disabled={contentUrl === '' || contentDescription === ''}
            />
            <Button
                style={styles.sharingButton}
                title='Share'
                onPress={sharePhoto}
            />
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
    },
    sharingContainer: {
        marginVertical: 10,
    },
});

export default App;
