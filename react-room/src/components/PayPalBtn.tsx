import React from "react";
import { PayPalButton } from "react-paypal-button-v2";

interface IpaypalProps {
	amount: number;
	onSuccess: (details: any, data: any) => void;
	currency: string;

}
const { REACT_APP_PAYPAL_ID } = process.env

class PayPalBtn extends React.Component<IpaypalProps>{

	render() {
		const { amount, onSuccess, currency } = this.props;
		return (
			<>
				<PayPalButton
					amount={amount}
					currency={currency}
					onSuccess={(details: any, data: any) => {
						onSuccess(details, data)
					}}
					options={{
						clientId: REACT_APP_PAYPAL_ID,
					}}
				>
				</PayPalButton>
			</>
		);
	}
}
export default PayPalBtn;
