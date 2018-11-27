import * as firebase from 'firebase/app';

export interface ISetting {
    value: number | string | boolean;
    type: string;
    group: string;
}

export default class Setting {
    protected data: ISetting;
    protected uid: string;
    protected listen: any;
    protected foreUpdate: any;
    /**
     * @param key: tên của setting
     * @param defaults: các giá trị mặc đinh nếu không được khởi tạo
     */
    constructor(uid: string, defaults: ISetting, foreUpdate: any) {
        this.data = { value: defaults.value, type: defaults.type, group: defaults.group };
        this.uid = uid;
        this.foreUpdate = foreUpdate;
        this.onSnapshot();
    }

    public save(): Promise<any> {
        return firebase.firestore().collection('settings').doc(this.uid).set(this.data);
    }
    public set value(val: string | boolean | number) {
        this.data.value = val;
    }
    public get value() {
        return this.data.value;
    }
    public get key() {
        return this.uid;
    }

    protected onSnapshot() {
        this.listen = firebase.firestore().collection('settings').doc(this.uid).onSnapshot(snapshot => {
            if (snapshot.exists) {
                this.data = (snapshot as any).data();
                this.foreUpdate();
            }
        })
    }
}