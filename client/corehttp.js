class coreHTTP {
  // To Read Tasks
  async get(url) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache"
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }

  // To Create Tasks
  async post(url, requestData) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      cache: "no-cache"
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }

  // To Update Tasks
  async put(url, requestData) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      cache: "no-cache"
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }

  // To Remove Tasks
  async delete(url) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache"
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      return {};
    } else {
      return Promise.reject(response.status);
    }
  }
}
