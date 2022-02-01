import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import {  useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';


const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClient = createClient(supabase_url, supabase_anon_key);

function messageListener(addMessage) {
	return supabaseClient.from('messages')
		.on('*', (response) => {addMessage(response.new)})
		.subscribe();
}

export default function ChatPage() {
	const routing = useRouter();
	const username = routing.query.username;
	const [ message, setMessage ] = React.useState('');
	const [ messageList, setMessageList ] = React.useState([]);
	const [ sendButton, setSendButton ] = React.useState(false);

	React.useEffect(() => {
		supabaseClient
		.from('messages')
		.select('*')
		.order('created_at', { ascending: false})
		.then(({ data }) => {
			setMessageList(data);
		});

		const subscription = messageListener((newMessage) => {
			setMessageList((currentList) => {
				return [newMessage, ...currentList,]
			});
		});
	
		return () => {subscription.unsubscribe()}

	}, []);

	function handleNewMessage(newMessage) {
		const messageObj = {'author': username, 'text': newMessage};
		supabaseClient.from('messages').insert([messageObj]).then(()=>{});
		setMessage('');
		setSendButton(false);
	}

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '70%',
                    maxWidth: '75%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList messages={ messageList } />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
							value = { message }
							onChange = { (event) => { 
								setMessage(event.target.value);
								message.length > 0 ? setSendButton(true) : null ;
							}}
							onKeyPress = { (event) => {
								if (event.key === 'Enter' && !event.shiftKey) {
									event.preventDefault();
									message.length > 0 ? handleNewMessage(message) : null ;
								}
							}}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
						<ButtonSendSticker 
							onStickerClick={(sticker) =>
								handleNewMessage(`:sticker: ${sticker}`)
							}
						/>
						<Button
							label='Send'
							size='xl'
							variant='primary'
							colorVariant='positive'
							rounded='full'
							onClick={ (event) => {message.length > 0 ? handleNewMessage(message) : null} }
							disabled={ !sendButton }
						/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

			{ props.messages.map( (message) => { 
				return (
            		<Text
		                key={message.id}
        		        tag="li"
                		styleSheet={{
		                    borderRadius: '5px',
        		            padding: '6px',
                		    marginBottom: '12px',
		                    hover: {
        		                backgroundColor: appConfig.theme.colors.neutrals[700],
                		    }
		                }}
        		    >
                		<Box
		                    styleSheet={{
        		                marginBottom: '8px',
                		    }}
		                >
        		            <Image
                		        styleSheet={{
                        		    width: '20px',
		                            height: '20px',
        		                    borderRadius: '50%',
                		            display: 'inline-block',
                        		    marginRight: '8px',
		                        }}
        		                src={`https://github.com/${ message.author }.png`}
                		    />
		                    <Text tag="strong">
		                        { message.author }
        		            </Text>
                		    <Text
                        		styleSheet={{
		                            fontSize: '10px',
        		                    marginLeft: '8px',
                		            color: appConfig.theme.colors.neutrals[300],
                        		}}
		                        tag="span"
        		            >
                		        {(new Date().toLocaleDateString())}
		                    </Text>
							<Button 
								variant='tertiary'
								colorVariant='negative'
								rounded='full'
								size='xs'
								label='x'
							/>
        		        </Box>
						{message.text.startsWith(':sticker:') ?
						(
							<Image src={message.text.replace(':sticker: ', '')} />
						):
						(
							<Text 
								styleSheet={{
									whiteSpace: 'pre-line',
								}}
							>
								{ message.text }
							</Text>
						)}
		            </Text>
				)
			})}
        </Box>
    )
}
