import React from "react";
import { Avatar } from "antd";
import moment from "moment";
import { Comment } from "@ant-design/compatible";

const Comments = ({ comments, currentUserId, onDeleteComment }) => {
	return (
		<>
			<div
				className="px-4 py-2 rounded-t-lg"
				style={{ backgroundColor: "#138585" }}
			>
				<h3 className="text-lg font-semibold text-white">Komentarze</h3>
			</div>
			<div className="max-h-96 overflow-y-auto p-4 mb-4 bg-gray-200 rounded-lg shadow">
				{comments.map((comment) => (
					<div
						className="my-2 p-3 border rounded-lg shadow-sm bg-white flex items-center"
						key={comment._id}
					>
						<div
							className="flex-shrink-0"
							style={{ width: "48px", height: "48px" }}
						>
							<Avatar
								className="flex-shrink-0"
								src={comment.createdBy.profilePic}
								alt={comment.createdBy.firstName}
							/>
						</div>
						<div className="flex-grow">
							<Comment
								author={
									<span className="font-medium">
										{comment.createdBy.firstName} {comment.createdBy.lastName}
									</span>
								}
								content={<p className="break-words">{comment.content}</p>}
								datetime={
									<span className="text-xs text-gray-500">
										{moment(comment.createdAt).fromNow()}
									</span>
								}
							/>
							{comment.createdBy._id === currentUserId && (
								<span
									className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer select-none"
									onClick={(e) => {
										e.stopPropagation();
										onDeleteComment(comment._id);
									}}
								>
									Usuń komentarz
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default Comments;
