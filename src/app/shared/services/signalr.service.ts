import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
  LogLevel
} from '@microsoft/signalr';
import { Observable } from 'rxjs';

export abstract class SignalRService {
  private connection?: HubConnection;
  private connected = false;
  private connecting = false;
  private closed = false;

  private reconnectDelay = 1000; // 1 segundo
  private maxReconnectAttempts = 5;

  protected abstract get hubUrl(): string; // URL do hub SignalR
  protected abstract getAuthorizationHeaderValue(): Promise<string>; // Método para buscar o token

  /**
   * Criação da conexão com o SignalR Hub
   */
  private createConnection(): HubConnection {
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => this.getAuthorizationHeaderValue(), // Token dinâmico
      transport: HttpTransportType.LongPolling, // Usa WebSockets como transporte
      withCredentials: false // Envia cookies e credenciais,
    };

    const hub = new HubConnectionBuilder()
      .withUrl(this.hubUrl, options)
      .configureLogging(LogLevel.Information) // Configura o nível de log
      .build();

    return hub;
  }

  /**
   * Método para iniciar a conexão com o hub
   */
  private connect(): Promise<HubConnection | undefined> {
    return new Promise((resolve, reject) => {
      const checkConnecting = () => {
        if (this.connecting) {
          setTimeout(checkConnecting, 100); // Checa se está conectando
        } else {
          if (!this.connected) {
            this.connecting = true;
            this.connection = this.createConnection();

            this.connection
              .start()
              .then(() => {
                this.connecting = false;
                this.connected = true;

                console.log('SignalR connected.');
                resolve(this.connection);
              })
              .catch((err) => {
                console.error('Error connecting to SignalR: ', err);
                this.connecting = false;
                reject(err);
              });

            this.handleReconnection();
          } else {
            resolve(this.connection);
          }
        }
      };

      checkConnecting();
    });
  }

  /**
   * Configura lógica de reconexão
   */
  private handleReconnection(): void {
    if (!this.connection) return;

    this.connection.onclose(() => {
      if (!this.closed) {
        console.log('Connection closed. Attempting to reconnect...');
        let attempts = 0;

        const reconnect = () => {
          if (attempts < this.maxReconnectAttempts) {
            attempts++;
            setTimeout(() => {
              this.connect()
                .then(() => {
                  console.log('Reconnected successfully.');
                })
                .catch((err) => {
                  console.error('Reconnection attempt failed: ', err);
                  reconnect(); // Tenta novamente
                });
            }, this.reconnectDelay);
          } else {
            console.error('Max reconnect attempts reached.');
          }
        };

        reconnect();
      }
    });
  }

  /**
   * Método para desconectar do hub
   */
  disconnect(): void {
    if (this.connected) {
      this.connection?.stop().then(
        () => {
          console.log('Disconnected from SignalR.');
          this.connected = false;
          this.closed = true;
        },
        (err) => {
          console.error('Error while disconnecting from SignalR: ', err);
        }
      );
    }
  }

  /**
   * Escuta eventos do hub
   * @param event Nome do evento
   * @param handler Função para processar os dados recebidos
   */
  protected listen<T>(event: string, handler: (...args: any[]) => T): Observable<T> {
    return new Observable<T>((observer) => {
      this.connect().then(
        () => {
          this.connection?.on(event, (...args: any[]) => {
            observer.next(handler(...args));
          });
        },
        (err) => {
          console.error('Error while listening to SignalR event: ', err);
          observer.error(err);
        }
      );
    });
  }
}
