async function client(endpoint, {
    data = null,
    contentType = 'application/json',
    fileUpload = false,
    ...customConfig
} = {}) {
    const headers = {};

    if (contentType !== null) {
        headers['Content-Type'] = contentType;
    }

    let body;
    if (data && data !== null) {
        body = (fileUpload ? data : JSON.stringify(data));
    }

    const config = {
        method: data ? 'POST' : 'GET',
        body,
        mode: 'cors',
        headers,
        ...customConfig,
    };

    return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
        if (response.status === 400) {
            const error = await response.json();

            return Promise.reject(error.error);
        }

        if (response.ok) {
            const responseContentType = response.headers.get('content-type');

            if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
                const responseData = await response.json();
                return responseData;
            }

            if (response.status === 204) {
                return null;
            }

            return {};
        }

        return Promise.reject(new Error('Unknown Error'));
    });
}

const handleApiError = (error) => {
    if (typeof error === 'string') {
        return error;
    }

    if (typeof error.message === 'string') {
        return error.message;
    }

    if (typeof error.error === 'string') {
        return error.error;
    }

    return 'An error has occurred';
};

class Api {
    static Post(endpoint, config = {}) {
        const apiConfig = {
            method: 'POST',
            ...config,
        };

        return client(endpoint, apiConfig).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Get(endpoint, config = { params: {} }) {
        let url = `${endpoint}?`;

        if (config.params) {
            Object.keys(config.params).forEach((key) => {
                url += `${key}=${config.params[key]}&`;
            });
        }

        url = url.substring(0, url.length - 1);

        return client(url, { method: 'GET' }).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Delete(endpoint, config = { params: {} }) {
        let url = `${endpoint}?`;

        if (config.params) {
            Object.keys(config.params).forEach((key) => {
                url += `${key}=${config.params[key]}&`;
            });
        }

        url = url.substring(0, url.length - 1);

        return client(url, { method: 'DELETE' }).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Put(endpoint, config = {}) {
        const apiConfig = {
            method: 'PUT',
            ...config,
        };

        return client(endpoint, apiConfig).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }
}