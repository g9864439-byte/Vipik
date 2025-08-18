import logging
import re
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = "7465560270:AAGHr8lRxYVJjgQzOdQmOKQxXi7qhVoF2ak"
ADMIN_ID = 381322163

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Кнопка открытия магазина"""
    
    keyboard = [[
        InlineKeyboardButton(
            text="🛒 Открыть магазин",
            web_app=WebAppInfo(url="https://g9864439-byte.github.io/Vipik/")
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "👋 Добро пожаловать в VapeHub!\n\n"
        "📱 Нажмите кнопку ниже чтобы открыть магазин\n"
        "📝 После оформления заказа скопируйте и отправьте его сюда\n",
        reply_markup=reply_markup
    )

async def handle_text_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка текстовых сообщений"""
    text = update.message.text
    
    # Проверяем, является ли это заказом
    if "ЗАКАЗ #" in text and "ИТОГО:" in text:
        logger.info(f"📦 Получен заказ от {update.effective_user.id}")
        
        # Извлекаем номер заказа
        order_match = re.search(r'ЗАКАЗ #(\d+)', text)
        order_number = order_match.group(1) if order_match else 'UNKNOWN'
        
        # Извлекаем сумму
        total_match = re.search(r'ИТОГО: ([\d.]+) BYN', text)
        total = total_match.group(1) if total_match else '0'
        
        # Отправляем подтверждение пользователю
        user_message = (
            f"✅ <b>Заказ #{order_number} принят!</b>\n\n"
            f"💰 Сумма: {total} BYN\n"
            f"📞 Ожидайте звонка от продавца!\n"
            f"⏱ Среднее время ожидания: 15-30 минут\n\n"
            f"Если есть вопросы, напишите @ZHIZHA_BOSS"
        )
        
        keyboard = [[
            InlineKeyboardButton("💬 Связаться с продавцом", url="https://t.me/ZHIZHA_BOSS")
        ], [
            InlineKeyboardButton("🛒 Новый заказ", web_app=WebAppInfo(url="https://g9864439-byte.github.io/Vipik/"))
        ]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_html(user_message, reply_markup=reply_markup)
        
        # Отправляем админу
        admin_message = (
            f"🆕 <b>НОВЫЙ ЗАКАЗ #{order_number}</b>\n\n"
            f"От: @{update.effective_user.username or 'Без username'}\n"
            f"ID: {update.effective_user.id}\n\n"
            f"<code>{text}</code>"
        )
        
        await context.bot.send_message(
            chat_id=ADMIN_ID,
            text=admin_message,
            parse_mode='HTML'
        )
        
        logger.info(f"✅ Заказ #{order_number} обработан")
        
    else:
        # Если это не заказ
        await update.message.reply_text(
            "❓ Не понял ваше сообщение.\n\n"
            "Для оформления заказа:\n"
            "1. Нажмите /start\n"
            "2. Откройте магазин\n"
            "3. Оформите заказ\n"
            "4. Скопируйте и отправьте текст заказа сюда"
        )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Команды
    app.add_handler(CommandHandler("start", start))
    
    # Текстовые сообщения
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text_message))
    
    logger.info("✅ Бот запущен и готов принимать заказы!")
    app.run_polling(drop_pending_updates=True)

if __name__ == '__main__':
    main()