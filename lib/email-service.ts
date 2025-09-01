import { Reminder, Event, Attendee } from '@/types';
import { format } from 'date-fns';

export class EmailService {
  private static readonly FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@smartscheduler.com';
  private static readonly SMTP_CONFIG = {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
  };

  static async sendEventInvitation(
    event: Event,
    attendee: Attendee,
    customMessage?: string
  ): Promise<boolean> {
    try {
      // Mock email sending - in production, integrate with email service
      console.log('Sending invitation email:', {
        to: attendee.email,
        subject: `Invitation: ${event.title}`,
        event,
        customMessage,
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      return false;
    }
  }

  static async sendEventReminder(
    event: Event,
    attendee: Attendee,
    reminder: Reminder
  ): Promise<boolean> {
    try {
      const subject = `Reminder: ${event.title} in ${this.formatReminderTime(reminder.minutesBefore)}`;
      
      console.log('Sending reminder email:', {
        to: attendee.email,
        subject,
        event,
        reminder,
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      return true;
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      return false;
    }
  }

  static async sendEventUpdate(
    event: Event,
    attendee: Attendee,
    changeType: 'updated' | 'cancelled' | 'rescheduled'
  ): Promise<boolean> {
    try {
      const subject = `Event ${changeType}: ${event.title}`;
      
      console.log('Sending update email:', {
        to: attendee.email,
        subject,
        event,
        changeType,
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      return true;
    } catch (error) {
      console.error('Failed to send update email:', error);
      return false;
    }
  }

  static generateInvitationTemplate(
    event: Event,
    attendee: Attendee,
    customMessage?: string
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're invited to: ${event.title}</h2>
        
        ${customMessage ? `<p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${customMessage}</p>` : ''}
        
        <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Event Details</h3>
          <p><strong>When:</strong> ${format(new Date(event.start), 'PPP p')} - ${format(new Date(event.end), 'p')}</p>
          ${event.location ? `<p><strong>Where:</strong> ${event.location}</p>` : ''}
          ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 0 10px;">Accept</a>
          <a href="#" style="background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 0 10px;">Decline</a>
          <a href="#" style="background: #ffc107; color: black; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 0 10px;">Tentative</a>
        </div>
      </div>
    `;
  }

  private static formatReminderTime(minutes: number): string {
    if (minutes === 0) return 'now';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  }

  static async processReminderQueue(): Promise<void> {
    try {
      // This would run as a background job to process pending reminders
      console.log('Processing reminder queue...');
      
      // In production, this would:
      // 1. Query events with upcoming reminders
      // 2. Send emails for due reminders
      // 3. Mark reminders as sent
      // 4. Handle failed sends with retry logic
      
    } catch (error) {
      console.error('Failed to process reminder queue:', error);
    }
  }
}