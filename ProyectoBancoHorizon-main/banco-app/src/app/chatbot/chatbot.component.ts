// chatbot.component.ts
import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';

interface Message {
  text: string;
  options?: string[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild('chatbotMessages') private chatbotMessagesContainer!: ElementRef;
  
  messages: Message[] = [];
  userInput: string = '';
  defaultOptions = [
    "¿Cuáles son los horarios de atención?",
    "¿Cómo puedo abrir una cuenta?",
    "¿Qué servicios ofrecen?",
    "¿Cómo puedo acceder a la banca en línea?",
    "¿Cómo puedo obtener una tarjeta de débito?",
    "¿Cómo puedo contactar con servicio al cliente?"
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.greetUser();
  }

  greetUser() {
    this.messages.push({ text: 'Bot: Hola, soy Z Bot, su asistente digital. ¿Qué desea hacer?' });
    this.showInitialOptions();
  }

  showInitialOptions() {
    this.messages.push({
      text: 'Bot: Aquí hay algunas opciones:',
      options: this.defaultOptions
    });
  }

  sendMessage(text: string) {
    this.messages.push({ text: 'User: ' + text });
    this.chatbotService.sendMessage(text).subscribe(response => {
      console.log('Response from backend:', response);

      if (response.fulfillmentText) {
        this.messages.push({ text: 'Bot: ' + response.fulfillmentText });
      }

      // Mostrar opciones iniciales después de cada respuesta
      this.messages.push({
        text: 'Bot: ¿Tienes alguna otra pregunta?',
        options: this.defaultOptions
      });

      // Scroll to bottom after new message
      setTimeout(() => this.scrollToBottom(), 100);

      // Reset user input
      this.userInput = '';
    });
  }

  selectOption(option: string) {
    this.userInput = option;
    this.sendMessage(option);
  }

  scrollToBottom() {
    try {
      this.chatbotMessagesContainer.nativeElement.scrollTop = this.chatbotMessagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  closeChatbot() {
    this.close.emit();
  }
}
