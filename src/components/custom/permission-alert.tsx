"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { checkCameraPermission, getPermissionGuide, type PermissionStatus } from "@/lib/permissions";

export function PermissionAlert() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [showAlert, setShowAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const status = await checkCameraPermission();
    setPermissionStatus(status);
    
    // Mostra alerta se permissão foi negada
    if (status === 'denied' && !dismissed) {
      setShowAlert(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowAlert(false);
  };

  if (!showAlert || permissionStatus !== 'denied') {
    return null;
  }

  return (
    <Alert className="bg-yellow-500/10 border-yellow-500/30 mb-6">
      <AlertCircle className="h-4 w-4 text-yellow-400" />
      <AlertDescription className="text-yellow-300 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium mb-1">Permissão de Câmera Necessária</p>
          <p className="text-sm text-yellow-300/80">
            Para usar o reconhecimento de alimentos e análise corporal, 
            você precisa habilitar a câmera nas configurações do navegador.
          </p>
          <details className="mt-2">
            <summary className="text-sm cursor-pointer hover:underline">
              Como habilitar?
            </summary>
            <p className="text-xs mt-1 text-yellow-300/70">
              {getPermissionGuide('camera')}
            </p>
          </details>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={checkPermissions}
            className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
          >
            <Settings className="w-4 h-4 mr-1" />
            Verificar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-yellow-300 hover:bg-yellow-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
