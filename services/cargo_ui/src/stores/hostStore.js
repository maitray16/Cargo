import { observable, action } from 'mobx';

class HostStore {

    @observable host = '';

    @action setHost(host) {
        this.host = host;
    }
}

export default new HostStore();