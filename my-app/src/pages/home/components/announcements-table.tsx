import { useState } from "react";
import styles from "./announcements-table.module.css";
import type { Announcement } from "../types/announcement";
import dayjs from "dayjs";
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGenerateAnnouncementsMutation,
  useUpdateAnnouncementMutation,
} from "../hooks/use-announcements-query";

type AnnouncementsTableProps = {
  announcements: Announcement[];
  isDisabled?: boolean;
};

type EditAnnouncementForm = {
  id: number | null;
  title: string;
  body: string;
  author: string;
  pinned: boolean;
};

export function AnnouncementsTable({
  announcements,
  isDisabled = false,
}: AnnouncementsTableProps) {
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [activeAnnouncementId, setActiveAnnouncementId] = useState<
    number | null
  >(null);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<EditAnnouncementForm | null>(null);

  const createAnnouncementMutation = useCreateAnnouncementMutation();
  const generateAnnouncementsMutation = useGenerateAnnouncementsMutation();
  const updateAnnouncementMutation = useUpdateAnnouncementMutation();
  const deleteAnnouncementMutation = useDeleteAnnouncementMutation();

  const isActionDisabled =
    isDisabled ||
    activeAnnouncementId !== null ||
    generateAnnouncementsMutation.isPending ||
    createAnnouncementMutation.isPending ||
    updateAnnouncementMutation.isPending ||
    deleteAnnouncementMutation.isPending;

  const handleGenerateData = async () => {
    if (isActionDisabled) {
      return;
    }

    try {
      await generateAnnouncementsMutation.mutateAsync();
      window.alert("Generated 100 announcements successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to generate data";
      window.alert(message);
    }
  };

  const handleOpenCreatePopup = () => {
    if (isActionDisabled) {
      return;
    }

    setFormMode("create");
    setEditingAnnouncement({
      id: null,
      title: "",
      body: "",
      author: "",
      pinned: false,
    });
  };

  const handleOpenEditPopup = (announcement: Announcement) => {
    if (isActionDisabled) {
      return;
    }

    setFormMode("edit");
    setEditingAnnouncement({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      author: announcement.author,
      pinned: announcement.pinned,
    });
  };

  const handleCloseEditPopup = () => {
    if (createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending) {
      return;
    }

    setFormMode(null);
    setEditingAnnouncement(null);
  };

  const handleEditFormChange = (
    field: keyof Omit<EditAnnouncementForm, "id">,
    value: string | boolean,
  ) => {
    setEditingAnnouncement((previousForm) => {
      if (!previousForm) {
        return previousForm;
      }

      return {
        ...previousForm,
        [field]: value,
      };
    });
  };

  const handleSubmitForm = async () => {
    if (!editingAnnouncement || !formMode || isActionDisabled) {
      return;
    }

    const trimmedTitle = editingAnnouncement.title.trim();
    const trimmedBody = editingAnnouncement.body.trim();
    const trimmedAuthor = editingAnnouncement.author.trim();

    if (!trimmedTitle || !trimmedBody || !trimmedAuthor) {
      window.alert("Title, Body, และ Author ห้ามว่าง");
      return;
    }

    try {
      if (formMode === "edit" && editingAnnouncement.id !== null) {
        setActiveAnnouncementId(editingAnnouncement.id);
        await updateAnnouncementMutation.mutateAsync({
          id: editingAnnouncement.id,
          payload: {
            title: trimmedTitle,
            body: trimmedBody,
            author: trimmedAuthor,
            pinned: editingAnnouncement.pinned,
          },
        });
      } else {
        setActiveAnnouncementId(-1);
        await createAnnouncementMutation.mutateAsync({
          title: trimmedTitle,
          body: trimmedBody,
          author: trimmedAuthor,
          pinned: editingAnnouncement.pinned,
        });
      }
      setFormMode(null);
      setEditingAnnouncement(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : formMode === "edit"
            ? "Unable to update announcement"
            : "Unable to create announcement";
      window.alert(message);
    } finally {
      setActiveAnnouncementId(null);
    }
  };

  const handleDelete = async (announcement: Announcement) => {
    if (isActionDisabled) {
      return;
    }

    const isConfirmed = window.confirm(
      `Delete announcement #${announcement.id}?`,
    );

    if (!isConfirmed) {
      return;
    }

    setActiveAnnouncementId(announcement.id);
    try {
      await deleteAnnouncementMutation.mutateAsync(announcement.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete announcement";
      window.alert(message);
    } finally {
      setActiveAnnouncementId(null);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <button
          className={styles.actionButton}
          type="button"
          onClick={handleGenerateData}
          disabled={isActionDisabled}
        >
          {generateAnnouncementsMutation.isPending
            ? "Generating..."
            : "Generate Data (100 rows)"}
        </button>
        <button
          className={styles.actionButton}
          type="button"
          onClick={handleOpenCreatePopup}
          disabled={isActionDisabled}
        >
          Create Announcement
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Author</th>
            <th>Pinned</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr
              key={announcement.id}
              className={announcement.pinned ? styles.pinnedRow : undefined}
            >
              <td>{announcement.id}</td>
              <td>{announcement.title}</td>
              <td>{announcement.body}</td>
              <td>{announcement.author}</td>
              <td>
                <span
                  className={
                    announcement.pinned ? styles.pinnedBadge : styles.normalBadge
                  }
                >
                  {announcement.pinned ? "Pinned" : "Normal"}
                </span>
              </td>
              <td>
                {dayjs(announcement.created_at).format("YYYY-MM-DD HH:mm:ss")}
              </td>
              <td>
                {dayjs(announcement.updated_at).format("YYYY-MM-DD HH:mm:ss")}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    type="button"
                    onClick={() => handleOpenEditPopup(announcement)}
                    disabled={isActionDisabled}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.actionButton}
                    type="button"
                    onClick={() => handleDelete(announcement)}
                    disabled={isActionDisabled}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingAnnouncement ? (
        <div className={styles.modalOverlay} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true">
            <h2 className={styles.modalTitle}>
              {formMode === "edit" ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <label className={styles.formField}>
              <span>Title</span>
              <input
                className={styles.input}
                value={editingAnnouncement.title}
                onChange={(event) =>
                  handleEditFormChange("title", event.target.value)
                }
              />
            </label>
            <label className={styles.formField}>
              <span>Body</span>
              <textarea
                className={styles.textarea}
                rows={4}
                value={editingAnnouncement.body}
                onChange={(event) =>
                  handleEditFormChange("body", event.target.value)
                }
              />
            </label>
            <label className={styles.formField}>
              <span>Author</span>
              <input
                className={styles.input}
                value={editingAnnouncement.author}
                onChange={(event) =>
                  handleEditFormChange("author", event.target.value)
                }
              />
            </label>
            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={editingAnnouncement.pinned}
                onChange={(event) =>
                  handleEditFormChange("pinned", event.target.checked)
                }
              />
              <span>Pinned</span>
            </label>
            <div className={styles.modalActions}>
              <button
                className={styles.actionButton}
                type="button"
                onClick={handleCloseEditPopup}
                disabled={
                  updateAnnouncementMutation.isPending ||
                  createAnnouncementMutation.isPending
                }
              >
                Cancel
              </button>
              <button
                className={styles.actionButton}
                type="button"
                onClick={handleSubmitForm}
                disabled={
                  updateAnnouncementMutation.isPending ||
                  createAnnouncementMutation.isPending
                }
              >
                {updateAnnouncementMutation.isPending ||
                createAnnouncementMutation.isPending
                  ? "Saving..."
                  : formMode === "edit"
                    ? "Save"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
