import React, { useEffect } from "react";
import { useProfileStore } from "../../store/profileStore";
import UserPost from "./UserPost";
import styles from "./UserPost.module.scss";

const UserPostList: React.FC = () => {
    const { posts, fetchUserPosts } = useProfileStore();

    useEffect(() => {
        fetchUserPosts();
    }, []);

    return (
        <div className={styles.postList}>
            <h2 className={styles.postHeader}>Жазбалар ({posts.length})</h2>
            <div className={styles.postsContainer}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <UserPost
                            key={post.id}
                            id={post.id}
                            image={post.image}
                            title={post.title}
                            goal={post.goal}
                            collected={post.collected}
                            participants={post.participants}
                        />
                    ))
                ) : (
                    <p className={styles.noPosts}>Посттар әлі жоқ</p>
                )}
            </div>
        </div>
    );
};

export default UserPostList;
