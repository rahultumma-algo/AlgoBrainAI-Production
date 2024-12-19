export interface FeedbackModalRef {
  openFeedback: () => void;
}

export interface FeedbackModalProps {
  onSubmit: (data: {
    rating: string;
    comment: string;
    name: string;
    email: string;
  }) => void;
} 