import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = "8326635737:AAHvbr2NDX72ZsdSRpvAU0ToO4LJnNu1a2M"
ADMIN_ID = 6759774187

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отправляет кнопку для открытия Mini App"""
    
    # ВАЖНО: Используем WebAppInfo
    web_app = WebAppInfo(url="https://g9864439-byte.github.io/Vipik/")
    
    keyboard = [[
        InlineKeyboardButton(
            text="🛒 Открыть магазин",
            web_app=web_app
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "👋 Добро пожаловать!\n\n"
        "🛒 Нажмите кнопку ниже, чтобы открыть магазин:",
        reply_markup=reply_markup
    )
    logger.info(f"Пользователь {update.effective_user.id} запустил бота")

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка данных из Mini App"""
    
    if not update.message.web_app_data:
        return
    
    logger.info("📦 ПОЛУЧЕНЫ ДАННЫЕ ИЗ MINI APP!")
    
    try:
        data = json.loads(update.message.web_app_data.data)
        logger.info(f"Данные: {data}")
        
        if data.get('type') == 'order':
            # Отправляем подтверждение пользователю
            message = data.get('message', f"✅ Заказ #{data['orderNumber']} создан!")
            await update.message.reply_html(message)
            
            # Уведомляем админа
            admin_message = (
                f"🆕 Новый заказ #{data['orderNumber']}\n"
                f"💰 Сумма: {data.get('total', 'Не указана')} BYN"
            )
            await context.bot.send_message(ADMIN_ID, admin_message)
            
            logger.info(f"✅ Заказ #{data['orderNumber']} обработан")
            
    except Exception as e:
        logger.error(f"Ошибка: {e}")
        await update.message.reply_text("❌ Ошибка обработки заказа")

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    logger.info("✅ Бот запущен!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()