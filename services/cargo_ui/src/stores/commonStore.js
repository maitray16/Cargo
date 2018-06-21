import { observable, action } from "mobx";

class CommonStore {

  @observable
  snackMessage = {
    message: null,
    title: null,
    level: null,
    position: null
  };

  setSnackError = (message,title) => {
    this.setSnackMessage(message, title , "error" , "tr");
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

}

export default new CommonStore();