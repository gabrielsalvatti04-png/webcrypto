import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  Link,
  Divider
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  function validate() {
    const n = name.trim();
    const em = email.trim();
    const pw = password.trim();
    if (n.length < 2) return 'Nome precisa ter pelo menos 2 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'Email inválido.';
    if (pw.length < 6) return 'Senha precisa ter pelo menos 6 caracteres.';
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg('');
    const v = validate();
    if (v) { setErrMsg(v); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined
      };
      await register(payload);
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 409) setErrMsg('Email já cadastrado. Tente outro.');
      else if (status === 400 && Array.isArray(data?.issues) && data.issues.length) {
        const i = data.issues[0];
        setErrMsg(`${data.error}: ${i.path?.join('.') || ''} ${i.message}`.trim());
      } else {
        setErrMsg(data?.error || 'Falha no cadastro.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0b0b0f',
        color: '#f5f5f7',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* fundo com gradiente sutil (igual ao Login) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.15), transparent 40%), radial-gradient(900px 500px at -10% 110%, rgba(16,185,129,0.12), transparent 35%)',
          pointerEvents: 'none'
        }}
      />

      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'rgba(20,20,26,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Header (igual ao Login) */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background:
                'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(16,185,129,0.9))',
              boxShadow: '0 0 24px rgba(99,102,241,0.35)'
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            Criar conta
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, pt: 2, display: 'grid', gap: 2 }}>
          {errMsg ? (
            <Box
              sx={{
                bgcolor: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#fecaca',
                px: 2,
                py: 1,
                borderRadius: 1.5,
                fontSize: 14
              }}
            >
              {errMsg}
            </Box>
          ) : null}

          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoFocus
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#f5f5f7'
              }
            }}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#f5f5f7'
              }
            }}
          />

          <TextField
            label="Telefone (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalPhoneIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#f5f5f7'
              }
            }}
          />

          <TextField
            label="Senha (mín. 6)"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw((v) => !v)}
                    edge="end"
                    aria-label="mostrar senha"
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#f5f5f7'
              }
            }}
          />

          <Button
            type="submit"
            size="large"
            disabled={submitting}
            sx={{
              mt: 0.5,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              color: '#0b0b0f',
              background:
                'linear-gradient(135deg, rgba(99,102,241,1), rgba(16,185,129,1))',
              boxShadow: '0 10px 26px rgba(99,102,241,0.35)',
              '&:hover': {
                filter: 'brightness(1.05)'
              }
            }}
            fullWidth
          >
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            Já tem conta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#a5b4fc', fontWeight: 600 }}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 12,
          color: 'rgba(255,255,255,0.45)'
        }}
      >
        Crypto Dashboard • v1.0
      </Typography>
    </Box>
  );
}
