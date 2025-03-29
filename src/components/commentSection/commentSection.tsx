import React, { useState, useEffect } from "react";
import styles from "./commentSection.module.scss";
import { fetchCommentsByPostId, sendComment, deleteComment, updateComment } from "../../api/publicationsApi";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../shared/assets/images/profile_default.png";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId, onCommentChange }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const { token } = useAuthStore();
    const { user } = useProfileStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const COMMENTS_PER_PAGE = 7;
    const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

    const handleShowMore = () => {
        setVisibleCount(prev => prev + COMMENTS_PER_PAGE);
    };


    // Загружаем комментарии
    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchCommentsByPostId(postId);
                setComments(data);
            } catch (error) {
                console.error("Ошибка загрузки комментариев:", error);
            } finally {
                setLoading(false);
            }
        };
        loadComments();
    }, [postId]);

    // Отправка нового комментария
    const handleSendComment = async () => {
        if (!comment.trim() || !token) return;

        try {
            const newComment = await sendComment(postId, comment, token);
            setComments((prev) => [newComment, ...prev]);
            setComment("");
            onCommentChange();
        } catch (error) {
            console.error("Ошибка при отправке комментария:", error);
        }
    };

    // Удаление комментария
    const handleDeleteComment = async (commentId) => {
        if (!token) return;

        try {
            await deleteComment(commentId, token);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            onCommentChange();
        } catch (error) {
            console.error("Ошибка при удалении комментария:", error);
        }
    };

    // Начать редактирование комментария
    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
    };

    // Сохранение редактированного комментария
    const handleSaveEdit = async (commentId) => {
        if (!token || !editedContent.trim()) return;

        try {
            await updateComment(commentId, editedContent, token);
            setComments((prev) =>
                prev.map((c) => (c.id === commentId ? { ...c, content: editedContent } : c))
            );
            setEditingCommentId(null);
        } catch (error) {
            console.error("Ошибка при обновлении комментария:", error);
        }
    };

    const goToUserProfile = (authorId) => {
        if (!authorId) return;

        if (user?.user_id === authorId) {
            navigate("/profiles/me/");
        } else {
            navigate(`/profiles/${authorId}/`);
        }
    };


    return (
        <div className={styles.container}>
            <h3>{t("leave_comment")}</h3>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("enter_your_comment")}
                className={styles.textarea}
            />
            <button onClick={handleSendComment} className={styles.sendButton}>{t("send")}</button>

            {loading ? (
                <p>{t("loading")}...</p>
            ) : (
                <div className={styles.commentsList}>
                    {comments.length > 0 ? (
                        <>
                            {comments.slice(0, visibleCount).map((c) => (
                                <div key={c.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <div
                                            className={styles.commentUser}
                                            onClick={() => goToUserProfile(c.author_id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img src={c.avatar || defaultAvatar} alt="Avatar" className={styles.avatar} />
                                            <strong className={styles.userName}>{c.author}</strong>
                                        </div>


                                        {user?.email && c.author === user.email && (
                                            <div className={styles.actions}>
                                                <button onClick={() => handleEditComment(c.id, c.content)} className={styles.editButton}>
                                                    {t("edit")}
                                                </button>
                                                <button onClick={() => handleDeleteComment(c.id)} className={styles.deleteButton}>
                                                    {t("delete")}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === c.id ? (
                                        <div className={styles.editContainer}>
              <textarea
                  className={styles.editTextarea}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
              />
                                            <button onClick={() => handleSaveEdit(c.id)} className={styles.saveButton}>
                                                {t("save")}
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{c.content}</p>
                                    )}

                                    <span className={styles.date}>{new Date(c.created_at).toLocaleString()}</span>
                                </div>
                            ))}

                            {visibleCount < comments.length && (
                                <button onClick={handleShowMore} className={styles.loadMoreButton}>
                                    {t("show_more")}
                                </button>
                            )}
                        </>
                    ) : (
                        <p>{t("no_comments")}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
