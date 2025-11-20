/**
 * Sistema de Permissões para Upload de Fotos
 * Gerencia permissões de câmera, galeria e armazenamento
 */

export type PermissionType = 'camera' | 'storage' | 'location';
export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface PermissionResult {
  status: PermissionStatus;
  message: string;
}

/**
 * Verifica se o navegador suporta a API de permissões
 */
export function isPermissionAPISupported(): boolean {
  return 'permissions' in navigator;
}

/**
 * Solicita permissão de câmera
 */
export async function requestCameraPermission(): Promise<PermissionResult> {
  try {
    // Tenta acessar a câmera
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true 
    });
    
    // Libera o stream imediatamente
    stream.getTracks().forEach(track => track.stop());
    
    return {
      status: 'granted',
      message: 'Permissão de câmera concedida'
    };
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      return {
        status: 'denied',
        message: 'Permissão de câmera negada. Habilite nas configurações do navegador.'
      };
    }
    
    if (error.name === 'NotFoundError') {
      return {
        status: 'unsupported',
        message: 'Nenhuma câmera encontrada no dispositivo.'
      };
    }
    
    return {
      status: 'denied',
      message: 'Erro ao solicitar permissão de câmera.'
    };
  }
}

/**
 * Verifica status da permissão de câmera
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  if (!isPermissionAPISupported()) {
    return 'unsupported';
  }

  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state as PermissionStatus;
  } catch {
    // Fallback: tenta acessar a câmera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return 'granted';
    } catch {
      return 'prompt';
    }
  }
}

/**
 * Valida arquivo de imagem antes do upload
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

export function validateImageFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<FileValidationResult> {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 200,
    minHeight = 200
  } = options;

  return new Promise((resolve) => {
    // Verifica tipo
    if (!allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}`
      });
      return;
    }

    // Verifica tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      resolve({
        valid: false,
        error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`
      });
      return;
    }

    // Verifica dimensões
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          error: `Imagem muito pequena. Mínimo: ${minWidth}x${minHeight}px`
        });
        return;
      }

      resolve({
        valid: true,
        file
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Erro ao carregar imagem'
      });
    };

    img.src = url;
  });
}

/**
 * Comprime imagem antes do upload
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calcula novas dimensões mantendo proporção
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Cria canvas e comprime
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Erro ao criar contexto do canvas'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Erro ao comprimir imagem'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erro ao carregar imagem'));
    };

    img.src = url;
  });
}

/**
 * Guia de permissões para o usuário
 */
export const PERMISSION_GUIDES = {
  camera: {
    chrome: 'Chrome: Configurações > Privacidade e segurança > Configurações do site > Câmera',
    firefox: 'Firefox: Configurações > Privacidade e segurança > Permissões > Câmera',
    safari: 'Safari: Preferências > Sites > Câmera',
    edge: 'Edge: Configurações > Cookies e permissões do site > Câmera'
  },
  storage: {
    general: 'Permita o acesso aos arquivos quando solicitado pelo navegador'
  }
};

/**
 * Detecta navegador do usuário
 */
export function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) return 'chrome';
  if (userAgent.includes('firefox')) return 'firefox';
  if (userAgent.includes('safari')) return 'safari';
  if (userAgent.includes('edge')) return 'edge';
  
  return 'unknown';
}

/**
 * Retorna guia de permissão específico do navegador
 */
export function getPermissionGuide(permission: PermissionType): string {
  const browser = detectBrowser();
  
  if (permission === 'camera') {
    return PERMISSION_GUIDES.camera[browser as keyof typeof PERMISSION_GUIDES.camera] 
      || PERMISSION_GUIDES.camera.chrome;
  }
  
  return PERMISSION_GUIDES.storage.general;
}
