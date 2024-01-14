import React from "react";
import { Card, Row, Col, Statistic } from "antd";

function StatsCard({ stats }) {
	const getSpan = () => {
		switch (stats.length) {
			case 2:
				return 12;
			case 3:
				return 8;
			default:
				return 6;
		}
	};
	const colSpan = getSpan();
	return (
		<Row gutter={16}>
			{stats.map((stat, index) => (
				<Col key={index} span={colSpan}>
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
