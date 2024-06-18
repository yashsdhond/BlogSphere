import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from '../components/index';
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deletePost } from "../store/postSlice";

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(false)

    const userData = useSelector((state) => state.auth.userData);
    const posts = useSelector((state) => state.posts)
    const post = posts.posts.find(item => item.$id === slug)

    const isAuthor = post && userData ? post.userid === userData.$id : false;

    const deletepost = () => {
        setDisabled(true);
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.Image);
                dispatch(deletePost(post.$id));
                navigate("/");
            }
        })
            .finally(() => setDisabled(false))
    };

    return post ? (
        <div className="py-12 px-2 min-h-screen">
            <Container>
                <div className="w-full relative flex justify-center bg-slate-200 rounded-xl pt-11 pb-11">
                    <img
                        src={appwriteService.previewFile(post.Image)}
                        alt={post.Title}
                        className="rounded-lg max-h-screen"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-600" className="text-white px-3 py-0.5 rounded-sm mr-3 hover:bg-green-500" Children={'Edit'} />
                            </Link>
                            <Button disabled={disabled} bgColor="bg-red-600" className="text-white px-3 py-0.5 rounded-sm hover:bg-red-500" onClick={deletepost} Children={'Delete'} />

                        </div>
                    )}
                </div>

                <div className="w-full text-center">
                    <h1 className="text-2xl font-bold mb-5">{post.Title}</h1>
                </div>
                <div className="p-3">
                    {parse(post.Content)}
                </div>
            </Container>
        </div>
    ) : null;
}