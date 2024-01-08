import React from "react";
import { Card, Row, Col, Statistic } from "antd";

function StatsCard({ stats }) {
	return (
		<Row gutter={16}>
			{stats.map((stat, index) => (
				<Col key={index} span={6}>
					<Card>
						<Statistic
							title={
								<div style={{ textAlign: "center", fontSize: 14 }}>
									{stat.title}
								</div>
							}
							value={stat.value}
							valueStyle={{
								color: "#3f8600",
								textAlign: "center",
								fontSize: 36,
							}}
							className="statistic"
						/>
					</Card>
				</Col>
			))}
		</Row>
	);
}

export default StatsCard;
