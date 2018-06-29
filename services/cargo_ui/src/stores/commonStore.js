import { observable, action } from "mobx";
import { get } from "../utils/apiUtils";

class CommonStore {
  @observable history = [];

  @observable
  snackMessage = {
    message: null,
    title: null,
    level: null,
    position: null
  };

  setSnackError = (message, title) => {
    this.setSnackMessage(message, title, "error", "tr");
  };

  @action
  setSnackMessage(
    message = null,
    title = null,
    level = "success",
    position = "tc"
  ) {
    this.snackMessage = {
      title: title,
      message: message,
      level: level,
      position: position
    };
  }

  @action
  getDataHistory() {
    get("/history")
      .then(response => {
        this.history = response.data.data;
      })
      .catch(err => {
        throw err;
      });
  }
}

export default new CommonStore();
