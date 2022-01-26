import { Box, Text } from '@skynexui/components';
import appConfig from '../config.json';

export default function Page404(props) {
	return (
		<>
			<Box 
				styleSheet={{
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					backgroundImage: 'url(https://c.tenor.com/fKIG2kiLVPgAAAAM/this-is-fine-its-fine.gif)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover', backgroundBlendMode: 'multiply',
				}}
			>
				<Box
					styleSheet={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexDirection: {
							xs: 'column',
							sm: 'row',
						},
						width: '100%', maxWidth: '700px',
						borderRadius: '5px', padding: '32px', margin: '16px',
						boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
						backgroundColor: appConfig.theme.colors.neutrals[700], 
						opacity: 0.9,
					}}
				>
					<Box 
						as="form"
						styleSheet={{
							display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							width: { xs: '100%', sm: '100%' }, textAlign: 'center', marginBottom: '32px',
						}}
					>
						<Text tag="h1">Oops!</Text>
						<Text variant="body3">Seems like you are trying to access a page that does not exist.</Text>
					</Box>
				</Box>
			</Box>
		</>
	)
}
