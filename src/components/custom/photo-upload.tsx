"use client";

import { useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  requestCameraPermission,
  checkCameraPermission,
  validateImageFile,
  compressImage,
  getPermissionGuide,
  type PermissionStatus,
  type FileValidationResult
} from "@/lib/permissions";

interface PhotoUploadProps {
  onImageSelect: (file: File, base64: string) => void;
  type: 'food' | 'body';
  disabled?: boolean;
}

export function PhotoUpload({ onImageSelect, type, disabled = false }: PhotoUploadProps) {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const status = await checkCameraPermission();
    setPermissionStatus(status);
  };

  const handleCameraClick = async () => {
    setError(null);

    // Verifica permissão primeiro
    if (permissionStatus === 'denied') {
      setShowPermissionDialog(true);
      return;
    }

    if (permissionStatus === 'prompt') {
      const result = await requestCameraPermission();
      setPermissionStatus(result.status);

      if (result.status === 'denied') {
        setShowPermissionDialog(true);
        return;
      }
    }

    // Aciona input de câmera
    document.getElementById(`camera-input-${type}`)?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Valida arquivo
      const validation: FileValidationResult = await validateImageFile(file, {
        maxSizeMB: 10,
        minWidth: 200,
        minHeight: 200
      });

      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        setIsProcessing(false);
        return;
      }

      // Comprime imagem
      const compressed = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85
      });

      // Converte para base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onImageSelect(file, base64);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Erro ao processar imagem');
        setIsProcessing(false);
      };
      reader.readAsDataURL(compressed);

    } catch (err: any) {
      setError(err.message || 'Erro ao processar imagem');
      setIsProcessing(false);
    }

    // Limpa input
    e.target.value = '';
  };

  const getUploadText = () => {
    if (type === 'food') {
      return {
        title: 'Reconhecimento de Alimentos',
        description: 'Tire uma foto do seu prato para análise nutricional',
        cameraText: 'Tirar Foto',
        uploadText: 'Escolher da Galeria'
      };
    }
    return {
      title: 'Análise Corporal',
      description: 'Envie uma foto do seu corpo para análise de evolução',
      cameraText: 'Tirar Foto',
      uploadText: 'Escolher da Galeria'
    };
  };

  const text = getUploadText();

  return (
    <>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-2">{text.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{text.description}</p>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {permissionStatus === 'denied' && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/30">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Permissão de câmera negada. Clique no botão abaixo para ver como habilitar.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Câmera */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-500 transition">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id={`camera-input-${type}`}
              disabled={disabled || isProcessing}
            />
            <Button
              onClick={handleCameraClick}
              disabled={disabled || isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processando...' : text.cameraText}
            </Button>
          </div>

          {/* Galeria */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`gallery-input-${type}`}
              disabled={disabled || isProcessing}
            />
            <label htmlFor={`gallery-input-${type}`}>
              <Button
                type="button"
                disabled={disabled || isProcessing}
                className="w-full bg-white/10 hover:bg-white/20"
                onClick={() => document.getElementById(`gallery-input-${type}`)?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                {isProcessing ? 'Processando...' : text.uploadText}
              </Button>
            </label>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-300 space-y-1">
              <p>• Formatos aceitos: JPG, PNG, WebP</p>
              <p>• Tamanho máximo: 10MB</p>
              <p>• Resolução mínima: 200x200px</p>
              <p>• A imagem será comprimida automaticamente</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialog de Permissões */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Permissão de Câmera Necessária
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Para usar a câmera, você precisa conceder permissão nas configurações do navegador.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-sm">
                {getPermissionGuide('camera')}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-300 font-medium">Como habilitar:</p>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Clique no ícone de cadeado/informações na barra de endereço</li>
                <li>Encontre "Câmera" nas permissões</li>
                <li>Selecione "Permitir"</li>
                <li>Recarregue a página</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowPermissionDialog(false)}
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/10"
              >
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setShowPermissionDialog(false);
                  checkPermissions();
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Verificar Novamente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
