import React from "react";
import styles from "./UserPost.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";

interface PostProps {
    id: string;
    image: string;
    title: string;
    goal: string;
    collected: string;
    participants: number;
}

const UserPost: React.FC<PostProps> = ({ id, image, title, goal, collected, participants }) => {
    return (
        <div className={styles.postCard}>
            <img src={image} alt={title} className={styles.postImage} />
            <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{title}</h3>
                <p className={styles.postGoal}>
                    <strong>{collected}</strong> жиналды <br />
                    {goal}, {participants} адам қосылды
                </p>
                <div className={styles.postActions}>
                    <IconSvg name="shareIcon" width="16px" height="16px" />
                    <IconSvg name="saveIcon" width="16px" height="16px" />
                </div>
            </div>
        </div>
    );
};

export default UserPost;
