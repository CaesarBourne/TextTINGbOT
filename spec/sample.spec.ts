import { describe } from 'mocha';
import { expect } from 'chai';
import { parseTextBotCommand } from '../src';
import { TEXTING_BOT_GROUPS } from './data';

describe('parseTextBotCommand', () => {
  describe('valid command structure', () => {
    it('finds the correct message and group', () => {
      expect(parseTextBotCommand('txt hotline foo', TEXTING_BOT_GROUPS)).to.deep.equals({
        groupId: '1',
        messageToSend: 'foo',
      });
    });

    it('parses single-word group with simple message', () => {
      const result = parseTextBotCommand('txt hotline Hello!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '1', messageToSend: 'Hello!' });
    });
    it('parses single-word group with simple message', () => {
      const result = parseTextBotCommand('txt hotline Hello!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '1', messageToSend: 'Hello!' });
    });

    it('parses multi-word group with normalized whitespace', () => {
      const result = parseTextBotCommand('txt sart group Go now!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '5', messageToSend: 'Go now!' });
    });

    it('handles mixed-case command and group names', () => {
      const result = parseTextBotCommand('Txt HoTlInE Alert!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '1', messageToSend: 'Alert!' });
    });

    it('trims message leading/trailing whitespace', () => {
      const result = parseTextBotCommand('txt test   Important update!   ', TEXTING_BOT_GROUPS);

      expect(result).to.deep.equal({ groupId: '3', messageToSend: 'Important update!' });
    });

    it('allows empty messages', () => {
      const result = parseTextBotCommand('txt test copy   ', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '4', messageToSend: '' });
    });
  });
  describe('group matching logic', () => {
    it('selects longest matching group (prefix match)', () => {
      const result = parseTextBotCommand('txt test copy backup', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '4', messageToSend: 'backup' });
    });

    it('selects longest matching group (mid-string)', () => {
      const result = parseTextBotCommand('txt hotline 1 status', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '2', messageToSend: 'status' });
    });

    it('ignores partial group name matches', () => {
      const result = parseTextBotCommand('txt hot backup', TEXTING_BOT_GROUPS);
      expect(result).to.be.null;
    });
  });

  describe('whitespace handling', () => {
    it('handles excessive internal whitespace', () => {
      const result = parseTextBotCommand('txt   hotline   1   System  down!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '2', messageToSend: 'System  down!' });
    });

    it('handles leading/trailing command whitespace', () => {
      const result = parseTextBotCommand('   txt hotline Ping   ', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '1', messageToSend: 'Ping' });
    });

    it('handles newlines in input', () => {
      const result = parseTextBotCommand('txt\nsart\ngroup\nUrgent!', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '5', messageToSend: 'Urgent!' });
    });
  });

  describe('failure cases and edge conditions', () => {
    it('rejects missing command prefix', () => {
      const result = parseTextBotCommand('hotline Hello', TEXTING_BOT_GROUPS);
      expect(result).to.be.null;
    });

    it('rejects empty input after command', () => {
      const result = parseTextBotCommand('txt   ', TEXTING_BOT_GROUPS);
      expect(result).to.be.null;
    });

    it('rejects empty input after command', () => {
      const result = parseTextBotCommand('txt   ', TEXTING_BOT_GROUPS);
      expect(result).to.be.null;
    });

    const validGroups = [
      { id: 'g1', name: 'Support' },
      { id: 'g2', name: 'Billing' },
    ];
    it('rejects potentially malicious input', () => {
      expect(parseTextBotCommand('txt <script>alert(1)</script>', validGroups)).to.be.null;
      expect(parseTextBotCommand('txt {malicious:true}', validGroups)).to.be.null;
    });

    it('rejects numbers only passed', () => {
      const result = parseTextBotCommand('11111', TEXTING_BOT_GROUPS);
      expect(result).to.be.null;
    });

    it('rejects empty string', () => {
      expect(parseTextBotCommand('', validGroups)).to.be.null;
    });

    it('rejects empty group names', () => {
      const emptyNameGroups = [
        { id: 'g1', name: '' },
        { id: 'g2', name: '  ' },
      ];
      expect(parseTextBotCommand('txt support help', emptyNameGroups)).to.be.null;
    });

    it('rejects whitespace-only input', () => {
      expect(parseTextBotCommand('   ', validGroups)).to.be.null;
    });

    it('rejects non-string input', () => {
      expect(parseTextBotCommand(123 as any, validGroups)).to.be.null;
    });
    it('handles empty string', () => {
      const result = parseTextBotCommand('', []);
      expect(result).to.be.null;
    });

    it('handles empty groups list', () => {
      const result = parseTextBotCommand('txt test Hello', []);
      expect(result).to.be.null;
    });

    it('rejects non string values', () => {
      const result = parseTextBotCommand(2344 as any, []);
      expect(result).to.be.null;
    });

    it('rejects types  passing string as second argument', () => {
      const result = parseTextBotCommand('txt test Hello', '' as any);
      expect(result).to.be.null;
    });

    it('rejects types  passing numbers as second argument', () => {
      const result = parseTextBotCommand('txt test Hello', 112233 as any);
      expect(result).to.be.null;
    });

    it('rejects group type arrays not in the required format', () => {
      const result = parseTextBotCommand('txt test Hello', ['as?'] as any);
      expect(result).to.be.null;
    });

    it('handles group names with special regex characters', () => {
      const result = parseTextBotCommand('txt a+b*c message', TEXTING_BOT_GROUPS);
      expect(result).to.deep.equal({ groupId: '7', messageToSend: 'message' });
    });
  });
});
