from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import json

BOT_TOKEN = "8326635737:AAHvbr2NDX72ZsdSRpvAU0ToO4LJnNu1a2M"
ADMIN_ID = 6759774187  # Ваш Telegram ID

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка данных из Mini App"""
    try:
        data = json.loads(update.effective_message.web_app_data.data)
        
        if data['type'] == 'order':
            # Формируем сообщение
            message = f"""
✅ <b>Вы успешно оформили заказ!</b>

📍 <b>Курьер ждёт вас на месте:</b> {data['delivery']['location']}
⏰ <b>В назначенное время:</b> {data['delivery']['time']}
💳 <b>Метод оплаты:</b> {data['payment']}
🆔 <b>ID заказа:</b> #{data['orderId']}

{'─' * 30}
<b>🛒 Товары:</b>
"""
            for item in data['items']:
                message += f"""
• <b>{item['name']}</b>
  Цвет/вкус: {item['color']}
  Количество: {item['quantity']} шт.
  Цена: {item['total']} BYN
"""
            
            message += f"""
{'─' * 30}
💰 <b>Цена товаров:</b> {data['totals']['products']} BYN
🚚 <b>Стоимость доставки:</b> {data['totals']['delivery']} BYN
💵 <b>Итоговая стоимость:</b> {data['totals']['total']} BYN
"""
            
            # Кнопки
            keyboard = [
                [InlineKeyboardButton("💬 Связь с продавцом", url="https://t.me/ZHIZHA_BOSS")],
                [InlineKeyboardButton("❌ Отменить заказ", callback_data=f"cancel_{data['orderId']}")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем пользователю
            await update.effective_message.reply_html(
                message,
                reply_markup=reply_markup
            )
            
            # Отправляем админу
            admin_message = f"🆕 Новый заказ #{data['orderId']}\n"
            admin_message += f"От: {data['user']['fullName']}\n"
            admin_message += f"Тел: {data['user']['phone']}\n"
            admin_message += f"TG: {data['user']['telegram']}\n"
            admin_message += f"Сумма: {data['totals']['total']} BYN"
            
            await context.bot.send_message(ADMIN_ID, admin_message)
            
    except Exception as e:
        print(f"Error: {e}")

# Запуск бота
app = Application.builder().token(BOT_TOKEN).build()
app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
app.run_polling()