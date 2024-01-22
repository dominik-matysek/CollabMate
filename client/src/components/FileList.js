import React from "react";
import { List, Button } from "antd";
import { IoTrashBin } from "react-icons/io5";

const FileList = ({ attachments, onDelete }) => {
	return (
		<>
			<div
				className="rounded-lg shadow "
				style={{ backgroundColor: "#138585" }}
			>
				<div className="px-4 py-2 ">
					<h3 className="text-lg font-semibold text-white">Pliki</h3>
				</div>
				<div>
					<List
						className="bg-white"
						bordered
						dataSource={attachments}
						renderItem={(item) => (
							<List.Item
								actions={[
									<Button
										className="p-1"
										onClick={(e) => {
											e.stopPropagation();
											onDelete(item);
										}}
									>
										<IoTrashBin />
									</Button>,
								]}
							>
								<List.Item.Meta
									title={
										<a
											href={item}
											target="_blank"
											rel="noopener noreferrer"
											className="truncate max-w-xs block"
										>
											{item.split("/").pop()}
										</a>
									}
								/>
							</List.Item>
						)}
					/>
				</div>
			</div>
		</>
	);
};

export default FileList;
