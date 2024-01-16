import React, { useState } from "react";
import { Input, Button } from "antd";

const CommentInput = ({ onCommentSubmit }) => {
	const [comment, setComment] = useState("");

	const handleSubmit = () => {
		onCommentSubmit(comment);
		setComment(""); // Reset comment input after submission
	};

	return (
		<div>
			<Input.TextArea
				rows={4}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Napisz komentarz..."
				className="mb-2"
			/>
			<Button
				type="primary"
				onClick={handleSubmit}
				disabled={!comment.trim()}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Skomentuj
			</Button>
		</div>
	);
};

export default CommentInput;
