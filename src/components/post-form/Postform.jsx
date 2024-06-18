import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addPost } from "../../store/postSlice";
import { updatePost } from "../../store/postSlice";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            Title: post?.Title || "",
            slug: post?.$id || "",
            Content: post?.Content || "",
            status: post?.status || "active",
        },
    });

    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()

    const submit = async (data) => {
        setError('')
        setDisabled(true)

        if (post) {
            try {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.Image);
                }
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    Image: file ? file.$id : undefined,
                });
                if (dbPost) {
                    dispatch(updatePost(dbPost))
                    navigate(`/post/${dbPost.$id}`);
                }

            } catch (error) {
                setError(error.message)
            }
            setDisabled(false)

        } else {
            try {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    const fileId = file.$id;
                    data.Image = fileId;
                    const dbPost = await appwriteService.createPost({ ...data, userid: userData.$id });
                    if (dbPost) {
                        dispatch(addPost(dbPost))
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            } catch (error) {
                setError(error.message)
            }
            setDisabled(false)
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "Title") {
                setValue("slug", slugTransform(value.Title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap py-6 my-12 bg-slate-200">
            <div className=" w-full px-6 flex flex-wrap justify-center">
                <div className="w-full flex flex-wrap justify-center gap-3">
                    <div>
                        <Input
                            label="Title : "
                            placeholder="Title"
                            className="ps-2 mr-2 sm:mr-8"
                            {...register("Title", { required: 'Title is required' })}
                        />
                        {errors.Title && <p className="text-red-600">{errors.Title.message}</p>}
                    </div>
                    <Input
                        label="Slug : "
                        placeholder="Slug"
                        className="mr-2 ps-2"
                        readOnly={true}
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                </div>
                <div className="mt-5 mb-5" >
                    <Input
                        label="Featured Image : "
                        type="file"
                        className=""
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {errors.image && <p className="text-red-600">Image is required</p>}
                    {post && (
                        <div className="w-full mt-3 text-center">
                            <img
                                src={appwriteService.previewFile(post.Image)}
                                alt={post.Title}
                                className="rounded-md"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full px-2 flex flex-col">
                <RTE label="Content :" name="Content" control={control} defaultValue={getValues("Content")} />

                <div className="w-full flex flex-wrap justify-center mb-4 mt-4">
                    <Select
                        options={["active", "inactive"]}
                        label="status"
                        className="mr-4 text-white bg-[#6a5acd] px-3 py-0.5 pb-1 rounded-md"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" disabled={disabled} className="text-white bg-green-600 px-3 py-0.5 rounded-md hover:bg-green-500" Children={post ? "Update" : "Submit"} />
                </div>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            </div>
        </form>
    );
}