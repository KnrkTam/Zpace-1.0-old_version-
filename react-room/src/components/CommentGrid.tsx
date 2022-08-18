import React, { useState } from "react";
import styles from "../css/CommentGrid.module.css";
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { Card } from "@material-ui/core";
import moment from "moment";
import { Col } from "react-bootstrap";

function CommentGrid({ element, starsArray }: any) {
	const [readMore, setReadMore] = useState(80);
	const [onClickReadMore, setOnClickReadMore] = useState(false);
	let profilePic = element.profile_picture;
	if (profilePic.slice(0, 5) !== "https") {
		profilePic = process.env.REACT_APP_API_SERVER + "/" + profilePic;
	}
	const StarRendering = ({ index }: any) => {
		let num = 0;
		if (element.rating >= index) {
			num = 1;
		}
		return (
			<>
				{num === 0 ? (
					<StarBorderRoundedIcon style={{ color: "#ff385d", marginRight: "2%" }} />
				) : (
						<StarRoundedIcon style={{ color: "#ff385d", marginRight: "2%" }} />
					)}
			</>
		);
	};
	const extraContent = <div>
		<div className="extra-content">
			{element.comment.slice(0, readMore)}
			<div className="read-more-link" style={{ cursor: "pointer" }} onClick={() => {
				if (!onClickReadMore) {
					setReadMore(element.comment.length)
				} else {
					setReadMore(80)
				}
				setOnClickReadMore(!onClickReadMore)
			}}><span className={styles.showMore}>{element.comment.length > 80 && (!onClickReadMore ? `View More` : `Show Less`)}</span></div>
		</div>
	</div>
	return (
		<>
			<Col sm={4} xs={12}>
				<Card elevation={3} className={styles.comment_card}>
					<div className={styles.userInfo_container}>
						<div className={styles.profileImg}>
							<img style={{ width: "50px" }} src={profilePic} alt="profile-pic" />{element.username}
						</div>
						<div className={styles.username_rating}>
							<div className={styles.rating}>
								{starsArray.length > 0 &&
									starsArray.map((e: any, indx: any) => {
										return <StarRendering key={indx} index={indx} />;
									})}
							</div>
						</div>
					</div>
					<hr className={styles.hr} />
					<div
						style={{
							marginLeft: "10px",
							marginRight: "10px",
							textAlign: "left",
						}}
						className={styles.comment}
					>
						{extraContent}
					</div>
					<div
						style={{ fontSize: "1rem", color: "#9e9e9e" }}
						className={styles.created_at}
					>
						{moment(element.created_at).format("MMM YYYY")}
					</div>
				</Card>
			</Col>
		</>
	);
}

export default CommentGrid;
