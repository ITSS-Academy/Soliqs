import {Storage} from '../../models/storage.model'

export interface StorageState {
    storage: Storage;
    isCreateLoading: boolean;
    isCreateSuccess: boolean;
    createErrorMessage: any;
    isGetLoading: boolean;
    isGetSuccess: boolean;
    getErrorMessage: any;
}