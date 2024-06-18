import { conf } from "../conf/conf.js";
import { Client, Databases, ID, Query, Storage } from "appwrite";

export class DatabaseService {
    client = new Client()
    databases;
    storage;

    constructor() {
        this.client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('6668767b0030a055660d');

        this.databases = new Databases(this.client)

        this.storage = new Storage(this.client)
    }

    async createPost({ Title, Content,Image, slug, status, userid }) {
        try {
            console.log(userid,"userid")
            console.log(Title,"userid")
            console.log(Content,"userid")
            console.log(Image,"userid")
            console.log(status,"userid")
            let createPo = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    Title,
                    Content,
                    Image,
                    status,
                    userid,
                
                }
            )
            return createPo;
        } catch (error) {
            // console.log("Error at createPost :: ", error)
            throw error
        }

    }

    async updatePost(slug, { Title, Content, Image, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    Title,
                    Content,
                    Image,
                    status
                }
            )
        } catch (error) {
            console.log("Error at updatePost :: ", error)
            throw error
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
            return true
        } catch (error) {
            console.log("Error at deletePost :: ", error)
            return false
        }
    }

    // async getPost(slug) {
    //     try {
    //         return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
    //     } catch (error) {
    //         console.log("Error at getPost :: ", error)
    //         return false
    //     }
    // }

    async getPosts() {
        try {
            let postss = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
            )
            return postss
        } catch (error) {
            console.log("Error at getPosts :: ", error)
            return false
        }
    }

    // File storage service

    async uploadFile(file) {
        try {
            console.log(conf)
            console.log(conf.appwriteBucketId)
            let fileData = await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
            return fileData
        } catch (error) {
            console.log("Error at uploadFile :: ", error)
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            let deleteData = await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            // return true
            return deleteData
        } catch (error) {
            console.log("Error at deleteFile :: ", error)
            return false
        }
    }

    previewFile(fileId) {
        try {
            return this.storage.getFilePreview(
                conf.appwriteBucketId,
                fileId
            )

        } catch (error) {
            console.log("Error at getFilePreview :: ", error)
            return false
        }
    }
}

const databaseService = new DatabaseService();
export default databaseService