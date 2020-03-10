import PagePost from "../viewModels/PagePost";
import PageInfo from "../viewModels/PageInfo";
import Photo from "../viewModels/Photo";

/**
 * Fetch pages info of current user
 * with permissions: pages_show_list, manage_pages
 */
export const fetchPagesInfo = (userID: string, userAccessToken: string) => {
    return fetch(`https://graph.facebook.com/${userID}/accounts?access_token=${userAccessToken}`)
        .then(response => response.json())
        .then(responseJson => {
            let result = [];
            let data = responseJson.data;
            if (data === undefined
                || !Array.isArray(data))
                return result;

            for (let i = 0; i < data.length; i++) {
                let pageInfo = new PageInfo(data[i]);
                result.push(pageInfo);
            }
            return result;
        })
        .catch((e) => []);
}

/**
 * Fetch page posts of current page
 * with permissions: pages_show_list, manage_pages
 */
export const fetchPagePosts = (pageId: string, pageAccessToken: string) => {
    return fetch(`https://graph.facebook.com/${pageId}/feed?access_token=${pageAccessToken}`)
        .then(response => response.json())
        .then(responseJson => {
            let result = [];
            let data = responseJson.data;
            if (data === undefined
                || !Array.isArray(data))
                return result;

            for (let i = 0; i < data.length; i++) {
                let pagePost = new PagePost(data[i]);
                result.push(pagePost);
            }

            return result;
        })
        .catch((e) => []);
}

export const publishAPostToPage = ({
    pageId,
    pageAccessToken,
    message
}: {
    pageId: string,
    pageAccessToken: string,
    message: string
}) => {
    return fetch(`https://graph.facebook.com/${pageId}/feed?message=${message}&access_token=${pageAccessToken}`, {
        method: 'POST'
        })
        .then((response: Response) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson);
            return `Publish a post success with id: ${responseJson.id}`
        }).catch((error: Error) => error.message);
}

export const fetchPagePhotos = ({
    pageId,
    pageAccessToken
}: {
    pageId: string,
    pageAccessToken: string,
}) => {
    return fetch(`https://graph.facebook.com/${pageId}/photos?access_token=${pageAccessToken}`)
        .then((response: Response) => response.json())
        .then((responseJson: any) => {
            let result = [];
            let data = responseJson.data;
            if (data === undefined
                || !Array.isArray(data))
                return result;

            for (let i = 0; i < data.length; i++) {
                let pagePost = new Photo(data[i]);
                result.push(pagePost);
            }

            return result;
        }).catch((error: Error) => []);
}

export const fetchPhoto = ({
    pageId,
    pageAccessToken,
    photoId
}) => {
    return fetch(`https://graph.facebook.com/${photoId}?fields=images&access_token=${pageAccessToken}`)
        .then((response: Response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
        }).catch((error: Error) => console.log(error.message))
}