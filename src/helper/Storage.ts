import * as firebase from 'firebase/app';

export default class Storage {
    public storage: any;
    public firestore: any;

    constructor() {
        this.storage = firebase.storage();
        this.firestore = firebase.firestore();
    }
    /**
     * Tải file lên
     * @param {*} file : input type file element 
     * @param {*} url : đường dẫn tải lên
     */
    public upload(args: any) {
        const { file, url, onUpdate, onComplete, onError, options } = args;

        const storage = this.storage.ref(url);

        const task = storage.put(file);

        task.on("state_changed",
            onUpdate,
            onError,
            () => {
                this.url(url).then((photoURL: string) => {
                    onComplete(photoURL);
                    let data = {photoURL, createdAt: new Date().getTime(), size: (file.size/1024).toFixed(2)};
                    if(options){
                        data = {...data, ...options};
                    }
                    this.firestore.collection('libraries').add(data);
                })
            }
        );
    }

    public url(url: string){
        return this.storage.refFromURL(`https://firebasestorage.googleapis.com/v0/b/${(window as any).config.projectId}.appspot.com/o/${url}`).getDownloadURL();
    }
}
