import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { BackButton } from "../../components/Reusable/BackButton";
import { Button } from "../../components/Reusable/Button";
import Menu from "../../components/Reusable/Menu";
import StatusModal from "../../components/Reusable/StatusModal";
import useResponsiveView from "../../hooks/useResponsiveView";
import {
  getEmailPreset,
  saveEmailPreset,
  resetEmailPreset,
  formatEmailBody,
  EmailPreset,
} from "../../logicHandlers/emailPresetHandler";
import "./Email.css";

const EmailPage: React.FC = () => {
  const history = useHistory();
  const isMobileView = useResponsiveView();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  // Load preset on mount
  useEffect(() => {
    try {
      const preset = getEmailPreset();
      setSubject(preset.subject);
      setBodyTemplate(preset.bodyTemplate);
    } catch (error) {
      console.error("Failed to load email preset:", error);
      openStatusModal(
        "Error",
        "Failed to load email preset.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    if (!subject.trim()) {
      openStatusModal(
        "Validation Error",
        "Email subject cannot be empty.",
        "warning"
      );
      return;
    }

    if (!bodyTemplate.trim()) {
      openStatusModal(
        "Validation Error",
        "Email body cannot be empty.",
        "warning"
      );
      return;
    }

    try {
      setIsSaving(true);
      const preset: EmailPreset = {
        subject,
        bodyTemplate,
      };
      saveEmailPreset(preset);
      openStatusModal(
        "Success",
        "Email preset has been saved successfully.",
        "success"
      );
    } catch (error) {
      console.error("Failed to save email preset:", error);
      openStatusModal(
        "Error",
        "Failed to save email preset. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to default email preset?")) {
      try {
        resetEmailPreset();
        const defaultPreset = getEmailPreset();
        setSubject(defaultPreset.subject);
        setBodyTemplate(defaultPreset.bodyTemplate);
        openStatusModal(
          "Reset Successful",
          "Email preset has been reset to default.",
          "success"
        );
      } catch (error) {
        console.error("Failed to reset email preset:", error);
        openStatusModal(
          "Error",
          "Failed to reset email preset.",
          "error"
        );
      }
    }
  };

  const previewBody = formatEmailBody(bodyTemplate, "John Doe");

  if (isLoading) {
    return (
      <div className="email-container">
        <div className="main-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="email-container">
        <div className="main-container">
          <div className="email-header">
            <BackButton
              className="btn email-btn-back"
              onClick={() => history.push("/admin-dashboard")}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>
            <h2>Email Settings</h2>
            {isMobileView && (
              <button
                type="button"
                className="icon-button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <IonIcon icon={menu} />
              </button>
            )}
          </div>

          <div className="email-content">
            <div className="form-section">
              <h3>Email Preset Configuration</h3>
              <p className="section-hint">
                Configure the email subject and body template that will be used when sending QR codes to members.
              </p>

              <div className="form-group">
                <label htmlFor="subject">Email Subject</label>
                <input
                  id="subject"
                  type="text"
                  className="email-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., DONDON'S FITNESS GYM QR Code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Email Body Template</label>
                <p className="field-hint">
                  Use <code>{"{"}</code><code>memberName</code><code>{"}"}</code> as a placeholder for the member's name.
                </p>
                <textarea
                  id="body"
                  className="email-textarea"
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  placeholder="Enter email body..."
                  rows={8}
                />
              </div>

              <div className="form-actions">
                <Button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  Reset to Default
                </Button>
              </div>
            </div>

            <div className="preview-section">
              <h3>Preview</h3>
              <p className="section-hint">
                This is how the email will look when sent to a member:
              </p>

              <div className="email-preview">
                <div className="preview-item">
                  <label>Subject Line:</label>
                  <div className="preview-value">{subject}</div>
                </div>

                <div className="preview-item">
                  <label>Email Body:</label>
                  <div className="preview-value preview-text">
                    {previewBody.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
    </>
  );
};

export default EmailPage;
