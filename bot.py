import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import json

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
        "Для оформления заказа:\n"
        "1️⃣ Нажмите кнопку ниже\n"
        "2️⃣ Выберите товары\n"
        "3️⃣ Оформите заказ\n"
        "4️⃣ Нажмите 'Отправить заказ в бот'\n\n"
        "⬇️ Начните покупки:",
        reply_markup=reply_markup
    )

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Получение данных из Mini App"""
    
    if not update.message.web_app_data:
        return
    
    try:
        # Получаем данные
        data = json.loads(update.message.web_app_data.data)
        logger.info(f"Получен заказ #{data.get('orderNumber')}")
        
        # Отправляем красивое сообщение пользователю
        user_message = (
            "✅ <b>Ваш заказ получен!</b>\n\n"
            f"{data.get('orderText', 'Заказ принят')}\n\n"
            "📞 Продавец свяжется с вами в ближайшее время!\n"
            "💬 Для связи: @ZHIZHA_BOSS"
        )
        
        # Кнопки под сообщением
        keyboard = [[
            InlineKeyboardButton("💬 Написать продавцу", url="https://t.me/ZHIZHA_BOSS")
        ], [
            InlineKeyboardButton("🛒 Новый заказ", web_app=WebAppInfo(url="https://g9864439-byte.github.io/Vipik/"))
        ]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_html(
            user_message,
            reply_markup=reply_markup
        )
        
        # Отправляем админу
        admin_message = (
            f"🆕 <b>НОВЫЙ ЗАКАЗ!</b>\n\n"
            f"{data.get('orderText', 'Детали заказа не указаны')}\n\n"
            f"От: @{update.effective_user.username or 'Пользователь'}"
        )
        
        await context.bot.send_message(
            chat_id=ADMIN_ID,
            text=admin_message,
            parse_mode='HTML'
        )
        
        logger.info(f"✅ Заказ #{data.get('orderNumber')} обработан")
        
    except Exception as e:
        logger.error(f"Ошибка: {e}")
        await update.message.reply_text(
            "❌ Ошибка обработки заказа\n"
            "Пожалуйста, свяжитесь с @ZHIZHA_BOSS"
        )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    logger.info("✅ Бот запущен и готов принимать заказы!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()