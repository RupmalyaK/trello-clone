import * as Api from "./Api";

export const getBoardsByUserId = (id) => {
  return GetRequest(`/boards/${id}`);
};

export const postBoard = (data) => {
  return PostRequest("/boards", data);
};

export const updateBoardById = (id,data) => {
  return PutRequest(`/boards/board/${id}`, data);
}

export const getBoardById = (id) => {
  return GetRequest(`/boards/board/${id}`);
}

export const addTaskInBoard = (data) => {
  return PostRequest("/tasks",data);
}
const GetRequest = (url) => {
  return new Promise(function (resolve, reject) {
    const obj = {
      url: url,
      onSuccess: (resp) => {
        resolve(resp);
      },
      onError: (err) => {
        reject(err);
        console.log("api error", err);
      },
    };
    Api.get(obj.url, obj.onSuccess, obj.onError);
  });
};

const PutRequest = (url, data) => {
  return new Promise(function (resolve, reject) {
    const obj = {
      url: url,
      data: data,
      onSuccess: (resp) => {
        resolve(resp);
      },
      onError: (err) => {
        reject(err);
        console.log("api error", err);
      },
    };
    Api.put(obj.url, obj.data, obj.onSuccess, obj.onError);
  });
};

function PostRequest(url, data) {
  return new Promise(function (resolve, reject) {
    let obj = {
      url: url,
      data: data,
      onSuccess: (resp) => {
        resolve(resp);
      },
      onError: (err) => {
        reject(err);
        console.log("api error", err);
      },
    };

    Api.post(obj.url, obj.data, obj.onSuccess, obj.onError);
  });
}

function DeleteRequest(url) {
  return new Promise(function (resolve, reject) {
    let obj = {
      url: url,
      onSuccess: (resp) => {
        resolve(resp);
      },
      onError: (err) => {
        reject(err);
        console.log("api error", err);
      },
    };

    Api.deleteApi(obj.url, obj.onSuccess, obj.onError);
  });
}

const GetWithCancel = (url) => {
  return new Promise(function (resolve, reject) {
    const obj = {
      url: url,
      onSuccess: (resp) => {
        resolve(resp);
      },
      onError: (err) => {
        reject(err);
        console.log("api error", err);
      },
    };
    Api.getWithCancel(obj.url, obj.onSuccess, obj.onError);
  });
};
