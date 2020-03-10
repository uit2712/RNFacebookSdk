import PagePost from "../viewModels/PagePost";
import PageInfo from "../viewModels/PageInfo";

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