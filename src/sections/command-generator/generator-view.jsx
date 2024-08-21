import styled from 'styled-components';
import { MdInfo } from 'react-icons/md';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import { Box, Select, Tooltip, MenuItem, Checkbox, Container, TextField, IconButton, Typography, FormControlLabel } from '@mui/material';

import argumentsConfig from 'src/components/arguments';

// ----------------------------------------------------------------------

const PreStyled = styled.pre`
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
  line-height: 1.5;
  max-width: 100%;
  box-sizing: border-box;

  .comment {
    color: #6a9955;
  }

  .command {
    color: #569cd6;
  }

  .path,
  .string {
    color: #ce9178;
  }

  .keyword {
    color: #c586c0;
  }
`;

// ----------------------------------------------------------------------

export default function GeneratorView() {
    const initializeArguments = () => {
        const initialArgs = {
            '--watch': 'custom_nodes\\ComfyUI_MaraScott_nodes\\',
            '-v': 'main.py',
            '--listen': 'local.marascott.ai',
            '--port': 443,
            '--reserve-vram': 0.5,
            '--tls-keyfile': 'C:\\Users\\Shadow\\.ssh\\comfyui_key.pem',
            '--tls-certfile': 'C:\\Users\\Shadow\\.ssh\\comfyui_cert.pem',
        };
        return initialArgs;
    };

    const [selectedArguments, setSelectedArguments] = useState(initializeArguments);
    const [command, setCommand] = useState('');

    const updateCommand = useCallback(() => {
        const argsString = Object.keys(selectedArguments)
            .map(argName => {
                const argument = argumentsConfig.find(arg => arg.name === argName);
                const value = selectedArguments[argName];
                let response = `${argName} ${value}`;
                if (typeof value === 'boolean') {
                    response = value ? `${argName}` : '';
                } else if (typeof argument !== 'undefined' && argument.type === 'select') {
                    response = value !== '' ? value : '';
                }
                return response;
            })
            .filter(Boolean)
            .join(' ');

        setCommand(`
<span class="comment">:: conda install pytorch torchvision torchaudio pytorch-cuda=12.4 -c pytorch -c nvidia</span>
<span class="comment">:: conda install -c conda-forge opencv deepdiff python-dotenv timm omegaconf numba rembg pynvml accelerate pytorch-lightning addict yapf</span>
<span class="comment">:: pip install wget piexif google groq openai pymatting blend_modes google-generativeai git+https://github.com/mlfoundations/open_clip.git mediapipe blend_modes xformers transparent_background</span>
<span class="comment">:: \\Path\\To\\ComfyUI_windows_portable\\python_embeded\\python.exe --version</span>
<span class="comment">:: conda create --name ComfyUI python=&lt;version above&gt;</span>
<span class="comment">:: conda activate ComfyUI</span>
<span class="comment">:: pip install jurigged pretty-errors</span>
<span class="comment">:: cd \\Path\\To\\ComfyUI</span>
<span class="comment">:: openssl req -x509 -newkey rsa:4096 -nodes -keyout C:\\Users\\Shadow\\.ssh\\comfyui_key.pem -out C:\\Users\\Shadow\\.ssh\\comfyui_cert.pem -days 365 -subj "/C=FR/ST=Brittany/L=Vannes/O=MaraScott/OU=IT/CN=MaraScott/emailAddress=david.asquiedge@marascott.ai"</span>
<span class="comment">:: openssl x509 -outform der -in C:\\Users\\Shadow\\.ssh\\comfyui_cert.pem -out C:\\Users\\Shadow\\.ssh\\comfyui_cert.crt</span>
<span class="command">python -m jurigged ${argsString}</span>
<span class="keyword">pause</span>`.trim());
    }, [selectedArguments]);

    useEffect(() => {
        updateCommand();
    }, [selectedArguments, updateCommand]);

    const handleCheckboxChange = (argName, isChecked) => {
        setSelectedArguments((prev) => {
            const updatedArgs = { ...prev };
            const argument = argumentsConfig.find(arg => arg.name === argName);

            if (isChecked) {
                if (typeof argument.defaultValue === 'boolean') {
                    updatedArgs[argName] = true;
                } else if (argument.type === 'select') {
                    updatedArgs[argName] = updatedArgs[argName] || '';  // Ensure an initial value is set if it is a select
                } else {
                    updatedArgs[argName] = argument.defaultValue !== undefined ? argument.defaultValue : '';
                }
            } else if (typeof argument.defaultValue === 'boolean') {
                updatedArgs[argName] = false;
            } else {
                delete updatedArgs[argName];
            }

            return updatedArgs;
        });
    };

    const handleInputChange = (argName, value) => {
        setSelectedArguments((prev) => ({
            ...prev,
            [argName]: value,
        }));
    };

    const renderInputComponent = (arg) => {
        if (Object.prototype.hasOwnProperty.call(selectedArguments, arg.name)) {
            if (arg.type === 'select') {
                return (
                    <Select
                        value={selectedArguments[arg.name] !== undefined ? selectedArguments[arg.name] : ''}
                        onChange={(e) => handleInputChange(arg.name, e.target.value)}
                        displayEmpty
                        sx={{ marginLeft: 2, width: '60%' }}
                    >
                        <MenuItem value="">
                            <em>select a value</em>
                        </MenuItem>
                        {arg.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                );
            } 
            return (
                <TextField
                    type={arg.type}
                    value={selectedArguments[arg.name] !== undefined ? selectedArguments[arg.name] : arg.defaultValue}
                    onChange={(e) => handleInputChange(arg.name, e.target.value)}
                    disabled={!Object.prototype.hasOwnProperty.call(selectedArguments, arg.name)}
                    variant="outlined"
                    size="small"
                    sx={{ marginLeft: 2, width: '60%' }}
                />
            );
        }

        return (
            <Typography variant="body2" sx={{ marginLeft: 2, width: '60%' }}>
                {arg.defaultValue}
            </Typography>
        );
    };

    return (
        <>
            <Helmet>
                <title> Command Generator </title>
            </Helmet>

            <Container>
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#fff',
                        zIndex: 1,
                        padding: '16px 0',
                        borderBottom: '1px solid #ddd',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Command Generator
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        <PreStyled className="bat" dangerouslySetInnerHTML={{ __html: command }} />
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxHeight: 'calc(100vh - 150px)',
                        overflowY: 'auto',
                        paddingTop: '16px'
                    }}
                >
                    {argumentsConfig.map((arg) => {
                        // const isSelectChecked = Object.prototype.hasOwnProperty.call(selectedArguments, arg.name) && arg.type === 'select';
                        const label = arg.name;

                        return (
                            <Box key={arg.name} mb={2} display="flex" alignItems="center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                typeof selectedArguments[arg.name] === 'boolean'
                                                    ? selectedArguments[arg.name]
                                                    : Object.prototype.hasOwnProperty.call(selectedArguments, arg.name)
                                            }
                                            onChange={(e) => handleCheckboxChange(arg.name, e.target.checked)}
                                            sx={{ transform: 'scale(0.8)' }}
                                        />
                                    }
                                    label={label}
                                    sx={{ fontSize: '0.9rem', flexGrow: 1 }}
                                />
                                {renderInputComponent(arg)}
                                <Tooltip title={arg.description} placement="top">
                                    <IconButton size="small" sx={{ marginLeft: 1 }}>
                                        <MdInfo size={24} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </>
    );
}
