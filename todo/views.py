from django.shortcuts import render, redirect
from django.utils.timezone import make_aware
from django.utils.dateparse import parse_datetime
from django.http import Http404
from todo.models import Task, Comment
from .forms import CommentForm

# Create your views here.
def index(request):
    if request.method == 'POST':
        task = Task(title=request.POST['title'],
                due_at=make_aware (parse_datetime(request.POST['due_at'])))
        task.save()

    if request.GET.get('order') == 'due':
        tasks = Task.objects.order_by('due_at')
    else:
        tasks = Task.objects.order_by('-posted_at')
    context = {
        'tasks': tasks
    }
    return render(request, 'todo/index.html', context)

def detail(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        raise Http404("Task does not exist")

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.task = task
            comment.save()
            return redirect('detail', task_id=task.id)
    else:
        form = CommentForm()

    comments = task.comments.all()  # 修正済み: comments を使用

    context = {
        'task': task,
        'form': form,
        'comments': comments,
    }
    return render(request, 'todo/detail.html', context)
    
def update (request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        raise Http404("Task does not exist")
    if request.method == 'POST':
        task.title = request.POST['title']
        task.due_at = make_aware(parse_datetime(request.POST['due_at']))
        task.save()
        return redirect(detail, task_id)
        
    context = {
        'task': task
    }
    return render (request, "todo/edit.html", context)
def close(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        raise Http404("Task does not exist")

    task.completed = True
    task.save()
    return redirect(index)

def delete(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        raise Http404("Task does not exist")
    
    task.delete()
    return redirect(index)
